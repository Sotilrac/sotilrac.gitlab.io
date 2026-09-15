#!/usr/bin/env python3
"""Checks for the BLE-capability test, which decides what counts as a design.

Espressif's line is the tricky part: ESP8266/8285 and ESP32-S2 carry no
Bluetooth radio, ESP32-S3 and the C/H series do, and filings describe all of
them inconsistently (an ESP32-C3 module is often filed as a "WIFI Module").
Every case here is one the detector got wrong at some point.
"""

import sys
import unittest

sys.path.insert(0, ".")

from fccble.analyze import is_ble
from fccble.sources import Grant


def grant(product_code: str, description: str) -> Grant:
    return Grant("FCCID", "GRANTEE", product_code, description, "DTS", [])


class BleDetection(unittest.TestCase):
    def assert_ble(self, product_code, description, expected):
        self.assertEqual(
            is_ble(grant(product_code, description)),
            expected,
            f"{product_code} / {description!r}",
        )

    def test_esp8266_family_is_wifi_only(self):
        for part in ("ESP8266EX", "ESPWROOM02", "ESPWROOM02D", "ESP8089M16", "ESP8285"):
            self.assert_ble(part, "Wi-Fi Internet of Things Module", False)

    def test_esp32_s2_has_no_bluetooth(self):
        self.assert_ble("ESP32S2WROOM", "Wi-Fi Module", False)
        self.assert_ble("ESPWROOMS2", "Wi-Fi Module", False)

    def test_esp32_s3_and_c_series_have_ble(self):
        # Filed as Wi-Fi-only, but the silicon carries BLE; the part wins.
        self.assert_ble("ESP32S3WROOM", "Wi-Fi Module", True)
        self.assert_ble("WT32C3S6", "WIFI Module", True)
        self.assert_ble("ESPC3MINI1", "Wi-Fi Module", True)
        self.assert_ble("ESPWROOM32DC", "Wi-Fi Module", True)

    def test_classic_esp32_has_ble(self):
        self.assert_ble("ESP32WROOM32E", "Wi-Fi & Bluetooth IoT Module", True)

    def test_nordic_parts_are_ble(self):
        for part in ("MDBT50Q", "NRF52840", "BMD-340", "NINA-B31"):
            self.assert_ble(part, "Bluetooth Low Energy Module", True)

    def test_unknown_part_falls_back_to_description(self):
        self.assert_ble("XYZ123", "Wi-Fi Module", False)
        self.assert_ble("XYZ123", "Bluetooth Low Energy Module", True)
        # Neither claim: kept rather than silently dropped.
        self.assert_ble("XYZ123", "Wireless Communication System Module", True)


if __name__ == "__main__":
    unittest.main(verbosity=2)
