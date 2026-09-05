---
author: Carlos
title: Real Certificates for a LAN Server
categories:
  - TIL
tags:
  - caddy
  - tls
  - dns
  - linux
  - self-hosting
---

A server that only answers on the LAN can still get a certificate that every browser trusts, with no self-signed warnings and no private CA to install on every phone in the house. The trick is the DNS-01 challenge: Let's Encrypt never connects to the server, it only checks a TXT record, so the name can point at `10.0.0.76` and the certificate still issues. This is how the [NAS](/drafts/i-went-bananas/) does it with Caddy, and what went wrong on the way.

## Point the names at the LAN

Two A records in the public zone of the domain, both aimed at the private address:

```text
nas.asmat.ca     A  10.0.0.76
*.nas.asmat.ca   A  10.0.0.76
```

The wildcard means every application gets its own hostname (`vault.nas.asmat.ca`, `jellyfin.nas.asmat.ca`) without another DNS change. Public DNS resolving to a private address is fine; the names work on the LAN and over WireGuard and are useless from anywhere else, which is the point. DNS-01 has two consequences to keep in mind before you debug anything. The certificate does not depend on these A records at all, so a valid certificate is no evidence that a name resolves, and a wildcard certificate is the only thing the public certificate transparency logs see, so the list of applications on the box stays private where a certificate per name would publish it.

## Delegate the challenge if your DNS host has no plugin

Caddy solves DNS-01 by writing the TXT record itself through the DNS host's API, so the host needs a [caddy-dns](https://github.com/caddy-dns) module. Mine (DreamHost) has one that was last touched in 2024 and no longer builds, and moving the zone to a host with a working module would have moved the mail records with it. The way out is CNAME delegation: ACME clients follow CNAMEs when they look up the challenge record, so one CNAME sends the challenge into a zone Caddy can write to.

[deSEC](https://desec.io) gives you a free `dedyn.io` zone with a good API and a maintained Caddy module. Create one, then add a single record at the original host:

```text
_acme-challenge.nas.asmat.ca  CNAME  _acme-challenge.asmat.dedyn.io
```

That record covers both `nas.asmat.ca` and `*.nas.asmat.ca`, because the wildcard's challenge record is the same `_acme-challenge.nas.asmat.ca`. Only A and CNAME records are touched in the parent zone: no NS, no DS, and the mail records stay as they were.

## Build Caddy with the DNS module

The packaged Caddy has no DNS modules. The download page at caddyserver.com builds one with the modules you pick, and the same thing is a `curl`:

```bash
curl -fL -o caddy 'https://caddyserver.com/api/download?os=linux&arch=amd64&p=github.com/caddy-dns/desec'
sudo install -m 755 caddy /usr/local/bin/caddy
```

[xcaddy](https://github.com/caddyserver/xcaddy) does the same build locally if you would rather not trust a binary from a website. Either way the result lives in `/usr/local/bin` where apt will never touch it. Keep the `caddy` package installed for the systemd unit and the `caddy` user, and point the unit at the custom binary with a drop-in. The same drop-in loads the API token, which never goes in the Caddyfile:

```ini
# /etc/systemd/system/caddy.service.d/override.conf
[Service]
ExecStart=
ExecStart=/usr/local/bin/caddy run --environ --config /etc/caddy/Caddyfile --adapter caddyfile
EnvironmentFile=/etc/caddy/caddy.env
```

```bash
echo 'DESEC_TOKEN=...' | sudo tee /etc/caddy/caddy.env
sudo chown root:caddy /etc/caddy/caddy.env
sudo chmod 640 /etc/caddy/caddy.env
sudo systemctl daemon-reload
```

That token can issue certificates for anything under the zone, so treat it like a password, and remember that anything with access to Caddy's admin API can read it back out of the running config.

## Write the Caddyfile

Every application binds `127.0.0.1` and is reachable only through Caddy, one `host` matcher and one `handle` each. The `tls` block is identical for the apex and the wildcard, so it goes in a snippet:

```caddyfile
{
	# Uncomment while testing. Staging has no meaningful rate limit;
	# production locks a name out for a week after five failures.
	# acme_ca https://acme-staging-v02.api.letsencrypt.org/directory
}

(lan_tls) {
	tls {
		dns desec {
			token {env.DESEC_TOKEN}
		}
		dns_challenge_override_domain _acme-challenge.asmat.dedyn.io
		propagation_timeout -1
		propagation_delay 90s
	}
	encode gzip
	header {
		Strict-Transport-Security "max-age=31536000"
		X-Content-Type-Options "nosniff"
		X-Frame-Options "SAMEORIGIN"
		Referrer-Policy "no-referrer"
	}
}

nas.asmat.ca {
	import lan_tls
	reverse_proxy 127.0.0.1:19999
}

*.nas.asmat.ca {
	import lan_tls

	@vault host vault.nas.asmat.ca
	handle @vault {
		reverse_proxy 127.0.0.1:8222
	}

	@jellyfin host jellyfin.nas.asmat.ca
	handle @jellyfin {
		reverse_proxy 127.0.0.1:8096
	}

	# Otherwise an unknown subdomain answers an empty 200, which reads
	# as "up and broken" rather than "no such service".
	handle {
		respond "no such service on this NAS" 404
	}
}
```

Two lines in that `tls` block cost me an evening each.

`dns_challenge_override_domain` takes the full name of the challenge record, verbatim. Caddy does not prepend `_acme-challenge` to it. Set to `asmat.dedyn.io`, it writes the TXT at the zone apex while the CNAME points one label lower, and Let's Encrypt gets NXDOMAIN. I found this by polling the deSEC API during an attempt and reading the subname Caddy had created.

`propagation_timeout -1` turns off Caddy's own check that the TXT record has propagated. Before asking the CA to validate, Caddy queries the zone's authoritative servers to confirm the record is visible, but my router intercepts every packet on port 53 and answers from its own cache, so that check read stale values and timed out even though deSEC publishes a record in about a second. Setting `resolvers` does not help, because those queries get intercepted too. The tell was the `ra` (recursion available) flag set on answers that claimed to come from authoritative-only servers, and the decisive evidence was four different answers for one record depending on who I asked. Let's Encrypt validates from outside the network anyway, which is the check that counts, and the fixed `propagation_delay` gives the record time to land without a check.

## Open the firewall and reload

Caddy runs on the host rather than in Docker so that ufw governs it: Docker inserts its rules ahead of ufw's, so a published container port is reachable from the LAN regardless of the ufw rules. I confirmed that with a test container before deciding.

```bash
sudo ufw allow from 10.0.0.0/24 to any port 80,443 proto tcp
sudo ufw allow from 192.168.2.0/24 to any port 80,443 proto tcp   # WireGuard
/usr/local/bin/caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
sudo systemctl reload caddy
journalctl -u caddy -f
```

Always `validate` then `reload`, never `restart`: a reload keeps the old configuration running if the new one is bad, while a restart with a bad file takes every service down at once. Use the custom binary for the validation; the packaged one on `PATH` has no deSEC module and rejects the `tls` block. Caddy also listens on 443/udp for HTTP/3, which these rules drop, so browsers fall back to TCP; add the UDP rule or turn HTTP/3 off, but do not leave a listener the firewall does not describe.

Until the DNS records have propagated, leave Caddy stopped. Every start is an issuance attempt, and failed attempts count against the production rate limit. Once the staging certificate issues, drop the `acme_ca` line and reload again for the real one.

## Debugging DNS from inside a network that lies

If the router intercepts DNS, `dig` tells you what the router thinks. Ask the public resolvers over HTTPS instead, and ask more than one:

```bash
curl -s -H 'accept: application/dns-json' \
  'https://cloudflare-dns.com/dns-query?name=_acme-challenge.nas.asmat.ca&type=TXT' | jq
curl -s -H 'accept: application/dns-json' \
  'https://dns.google/resolve?name=_acme-challenge.nas.asmat.ca&type=TXT' | jq
```

Two more things that look like bugs and are not. A failed attempt against a name that does not exist gets cached as NXDOMAIN for the zone's negative TTL, an hour on deSEC, so after fixing the config the right move is to wait, not to change anything else; Cloudflare had the corrected chain immediately while Google served the stale answer for most of that hour. And the apex and the wildcard are two certificates, and both challenges write to the same overridden record; if the two renew at the same instant, one can overwrite the other's TXT and that issuance fails and retries on its own. The renewal windows drift apart in practice, but it is the first thing to suspect when a renewal fails for no visible reason.
