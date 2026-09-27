---
title: "if"
categories:
  - software
tags:
  - if
---

Philip II of Macedon, having taken the submission of most of southern Greece, asked Sparta whether he should come as friend or foe; they answered "Neither." He then threatened: "If I invade Laconia, I will uproot you from your land." The Spartans replied: "If."

This masterful display of succinctness is perhaps why I have an aversion to `if` statements in code. Of course, they are necessary, but overusing them smells of poor software design to me. When I say I hate `if` statements, people look at me as if I'm insane. After all, any time anyone chimes in on how a piece of software ought to work, they say something like "oh, just make it so if _some condition_, it does _some action_."

As we already covered in the [sigmoids post](/blog/sigmoids-are-the-best/), this is a bad approach for implementing thresholds on physical quantities. But I want to go further into why it's a bad idea even when the `if` represents a concept with a hard condition. I have a feeling that when you think a problem through, you can implement it without `if` statements, or at least with very few. And although I had encountered this countless times in the wild, I didn't have a good set of examples to illustrate it.

It turns out that other, quite prominent, programmers have thought about this too, so we can put together some examples to illustrate each of the cases they describe.

<!-- insert one section per reference per type of if pitfall. illustrate with one of the code examples. cukminate on linus' example  -->

<!-- insert one section for good if examples-->

In the end, Sparta's `if` condition became true. Luckily for them, it seems they had considered the consequences of their `if` statement: the Macedonians did invade and did take some land from the Spartans, although not Sparta itself.

<!-- notes for post below -->

# Guide: the case against too many ifs

Working notes for a blog post. Quotes are kept short and each source is quoted once; everything else is paraphrased, so check the originals before publishing.

## Thesis

The if statement is necessary. The problem is how it gets used: the same question asked in many places, conditions piled up until the paths can't be enumerated, and branches that exist only because of how the problem was framed. In physical systems there is a second problem: a branch on a continuous signal produces a discontinuous output.

A narrower version of the claim is easier to defend than "ifs are bad":

1. A decision should be made once, as close to the system boundary as possible.
2. Every condition multiplies the states the code can be in, and corner cases live in the combinations.
3. Many ifs disappear when you compute toward the goal instead of enumerating constraints.
4. In control code, continuity of the output matters more than the branching syntax.

## Suggested outline

1. Hook: the laconic if (below), then the nested if pyramid everyone has inherited, or a torque step felt through an exoskeleton.
2. Where the idea comes from: the Anti-IF Campaign and its critics.
3. Why ifs cause bugs: path counting and cyclomatic complexity.
4. Switch statements and the one-switch rule.
5. Goal versus constraints: the examples where the ifs just vanish.
6. The robotics section: discontinuities, thresholds, hysteresis.
7. Where ifs belong: boundaries, safety limits, real decisions.
8. Counterarguments and where you concede.

## Opening: the laconic if

The most famous if in history is a whole reply. As Plutarch reports it, Philip II of Macedon, having taken the submission of most of southern Greece, asked Sparta whether he should come as friend or foe; the answer was "Neither." He then threatened: "If I invade Laconia, I shall turn you out." The Spartan ephors replied with one word: "If." The word laconic comes from Laconia, the region around Sparta.

Ways to use it:

- As the ideal: one if, carrying the whole decision, with nothing duplicated or nested.
- As the joke about conditionals: the Spartans answered the threat by pointing at the condition, which is where the uncertainty and the risk are.
- As the twist, if you want one: Philip did invade, devastated much of Laconia and drove the Spartans out of parts of it. The branch was taken. Even a perfect if still has two paths, and one of them has to be handled.

The wording of Philip's threat varies between translations (some versions promise slavery or razing the city), so quote one translation and name it.

## Concepts

### Duplicated decisions

The same question (what type is this, what mode are we in, is this null) asked in several places is the real smell. Adding a variant means finding every place that asks. The code-smell literature calls the result shotgun surgery, and notes that repeated switches on the same enum drift out of sync. Wai Lee Chin Feman's 8th Light post makes the same point from the other side: conditionals are fine until you duplicate them.

### Booleans throw away information

John De Goes argues the issue is the boolean the if needs, more than the if itself: "A boolean value reduces a huge amount of information to a single bit." He ends up calling it a protocol problem, where types are used to encode program meaning. Useful for the section on flags.

### Paths multiply

McCabe's cyclomatic complexity (1976) counts linearly independent paths through a function, roughly decision points plus one, and under basis path testing that number is the count of tests you need. It grows linearly with each if. Your stronger point is that independent conditions combine multiplicatively: three independent booleans give eight states, and the corner cases are the combinations no test covers. That argument is yours, so present it as such rather than attributing it to McCabe.

### The one-switch rule

Robert Martin in Clean Code: switch statements "can be tolerated if they appear only once," used to create polymorphic objects and hidden from the rest of the system. In Python terms: match once at the edge (parsing a command, a message, a config), build typed objects, and let the rest of the code call methods. Python's match (3.10+) is structural pattern matching, which is more capable than a C switch and is at its best in exactly that parsing role.

### Special case becomes the normal case

Linus Torvalds, 2016 TED interview, comparing two linked-list removal functions where one needs a special case for the head: "sometimes you can see a problem in a different way and rewrite it" so the special case goes away. This is the anchor quote for the goal-versus-constraints section.

### Define errors out of existence

John Ousterhout, A Philosophy of Software Design. His examples: Tcl's unset would have been simpler if it meant "make sure this variable doesn't exist afterward" instead of failing on a missing variable, and Java's substring could return whatever characters fall in the range instead of throwing on out-of-range indices. Python slicing already behaves this way: an out-of-range slice returns an empty result.

### Goal versus constraints

Constraint-driven code enumerates situations and each situation becomes a branch. Goal-driven code asks what quantity or end state is wanted, and the situations fall out of the arithmetic or the data structure. The heuristic for readers: before writing an if, ask what you are computing. If it is a quantity, look for the formula where the edge case is just a value (zero, a wrap, a sign). If it is a structure, look for the representation where the edge is a normal element (sentinel, identity value, missing key).

### Discontinuities in control

A threshold on a continuous signal produces a step: infinite jerk at the switch point, and chatter when the signal is noisy near the threshold. The textbook precedent is sliding mode control, where the discontinuous sign term causes chattering; Slotine's fix was a thin boundary layer around the switching surface, replacing sign() with a saturation function. The trade-off: the smooth version gives tracking within a bound instead of perfect tracking, so some steady-state error remains. A later analysis also found that with parasitic dynamics the boundary layer only removes chattering if its slope is low enough, which costs performance. Good material for showing you know the limits.

The criterion is continuity of the output, not whether the word "if" appears. A clamp has branches inside it and its output is continuous.

### Hysteresis for real mode switches

Some decisions are modal (stance or swing, assist on or off) and can't be blended. A bare threshold still fails on noise. Otto Schmitt solved this in 1934 with two thresholds, one for rising and one for falling input, so noise inside the window can't toggle the output. In software: decide in one place, give the decision memory, add a minimum dwell time, and blend actuator commands across the transition.

### Where ifs belong

Safety limits (e-stop, overcurrent, joint limits) should be hard discontinuities, because an abrupt stop is the intended behaviour when something faults. Input validation and parsing at the boundary. Real business decisions that are stable and read naturally. The pattern is the same as the one-switch rule: rare, intentional, at the edge.

## Examples (Python)

### Dispatch table instead of an if chain

```python
# before
def export(report, fmt):
    if fmt == "csv":
        return to_csv(report)
    elif fmt == "json":
        return to_json(report)
    elif fmt == "pdf":
        return to_pdf(report)
    else:
        raise ValueError(fmt)

# after
EXPORTERS = {"csv": to_csv, "json": to_json, "pdf": to_pdf}

def export(report, fmt):
    return EXPORTERS[fmt](report)
```

Adding a format is a data change. An unknown format raises KeyError.

### Polymorphism instead of a repeated match

```python
# before: this match reappears in perimeter(), draw(), to_json()...
def area(shape):
    match shape.kind:
        case "circle": return math.pi * shape.r ** 2
        case "square": return shape.side ** 2

# after: the question is asked once, when the object is built
class Circle:
    def __init__(self, r): self.r = r
    def area(self): return math.pi * self.r ** 2

class Square:
    def __init__(self, side): self.side = side
    def area(self): return self.side ** 2
```

### Boolean flags versus composition

```python
# 2**3 = 8 behaviours, some probably nonsensical
def send(msg, urgent=False, retry=False, encrypt=False): ...

# compose behaviour instead of branching on it
def send(msg, transport):
    transport.deliver(msg)

send(msg, Retrying(Encrypted(SmtpTransport())))
```

### Null Object instead of None checks

```python
class NoDiscount:
    def apply(self, price): return price

class PercentOff:
    def __init__(self, pct): self.pct = pct
    def apply(self, price): return price * (1 - self.pct)

total = user.discount.apply(price)  # no "if discount is not None"
```

### Interval overlap: constraints versus goal

```python
# constraints: enumerate every relationship, easy to miss one
def overlaps(a, b):
    if a.start <= b.start <= a.end: return True
    if a.start <= b.end <= a.end: return True
    if b.start <= a.start and b.end >= a.end: return True
    return False

# goal: neither interval ends before the other starts
def overlaps(a, b):
    return a.start < b.end and b.start < a.end

# goal, if you want the amount: no-overlap is just zero
def overlap(a, b):
    return max(0, min(a.end, b.end) - max(a.start, b.start))
```

### Angle error with wraparound

```python
# constraints: breaks if inputs are already outside +/-360
def angle_error(target, current):
    e = target - current
    if e > 180:
        e -= 360
    elif e < -180:
        e += 360
    return e

# goal: shortest signed rotation is modular arithmetic
def angle_error(target, current):
    return (target - current + 180) % 360 - 180
```

### Signed motor command

```python
# constraints: direction and magnitude handled separately
if error > 0:
    set_direction(FORWARD)
    set_duty(min(abs(error) * kp, 1.0))
else:
    set_direction(REVERSE)
    set_duty(min(abs(error) * kp, 1.0))

# goal: a signed torque, the sign is the direction
cmd = max(-1.0, min(error * kp, 1.0))
drive.set(cmd)
```

The sign-to-H-bridge translation lives in the driver, once.

### Linked list removal with a sentinel (the Torvalds example in Python)

```python
# before: the head is a special case
def remove(lst, target):
    if lst.head is target:
        lst.head = target.next
        return
    node = lst.head
    while node.next is not target:
        node = node.next
    node.next = target.next

# after: a dummy head makes the first node a normal node
def remove(sentinel, target):
    node = sentinel
    while node.next is not target:
        node = node.next
    node.next = target.next
```

Torvalds' C version uses a pointer to a pointer; the sentinel node is the Python equivalent.

### Grid neighbours without boundary checks

```python
# constraints: four edge checks
def neighbours(grid, r, c):
    out = []
    if r > 0: out.append(grid[r-1][c])
    if r < len(grid) - 1: out.append(grid[r+1][c])
    if c > 0: out.append(grid[r][c-1])
    if c < len(grid[0]) - 1: out.append(grid[r][c+1])
    return out

# goal: cells keyed by coordinate, "outside" means "not in the dict"
def neighbours(cells, r, c):
    steps = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    return [cells[p] for dr, dc in steps if (p := (r + dr, c + dc)) in cells]
```

A test remains, but it is the goal ("is this a cell?") rather than four constraints about edges.

### Threshold versus smooth blend (exoskeleton assistance)

```python
# before: torque jumps from 0 to 12 Nm at 1.2 m/s, chatters on noisy speed
def assist_torque(speed):
    if speed > 1.2:
        return 12.0
    return 0.0

# after: ramp across a blend band
def smoothstep(x, lo, hi):
    t = min(max((x - lo) / (hi - lo), 0.0), 1.0)
    return t * t * (3 - 2 * t)

def assist_torque(speed):
    return 12.0 * smoothstep(speed, 1.0, 1.4)
```

Smoothstep is continuous with zero slope at both ends of the band, so assistance fades in.

### Saturation instead of sign (sliding mode style)

```python
def sat(x):
    return max(-1.0, min(x, 1.0))

u_hard = -k * math.copysign(1.0, s)   # chatters around s = 0
u_soft = -k * sat(s / phi)            # boundary layer of width phi
```

### Hysteresis for a real mode switch

```python
class Hysteresis:
    def __init__(self, low, high, state=False):
        self.low, self.high, self.state = low, high, state

    def update(self, x):
        if x > self.high:
            self.state = True
        elif x < self.low:
            self.state = False
        return self.state

walking = Hysteresis(low=0.3, high=0.5)
```

The decision is made in one place, has memory, and everything downstream reads a clean state.

## Counterarguments to address

The anti-if position has a reputation for dogma, and the post is stronger if it concedes early.

Wai Lee Chin Feman (8th Light, 2013): "I think that we hate conditionals more than we should." Treat this as an ally, since the title of the post (conditionals are only evil when duplicated) matches your refined thesis.

Joe Jag (2016) found the campaign absurd at first and notes the campaign site "is sadly low on practical advice." Cite him as the practical follow-up and as a sceptic who came round to the idea.

Casey Muratori, "Clean Code, Horrible Performance": uses shape area calculations to argue polymorphism-heavy clean code is much slower than a switch over a tagged union, by up to around 15x in his benchmark. Relevant to embedded readers. Concede it for hot loops and firmware, and note that the dispatch-table and arithmetic examples don't pay that cost.

Elf Sternberg's review of Clean Code would drop both polymorphism and switch in favour of "a lookup table: cheap, easy, direct, comprehensible." This supports the dispatch-table example over class hierarchies. A possible landing for the post: prefer data over branches, and objects over data only when behaviour really varies.

Smoothing has a cost. Boundary layers trade exact tracking for bounded error, and too steep a blend can still chatter with unmodelled dynamics.

## References

Verify each link before publishing; the list mixes primary sources with secondary write-ups.

- Plutarch, Sayings of Spartans (Moralia), source of the "If" reply; overview: https://en.wikipedia.org/wiki/Laconic_phrase
- Francesco Cirillo, Anti-IF Campaign (2007): https://francescocirillo.com/pages/anti-if-campaign
- Joe Jag, "Anti-If: The missing patterns" (2016): https://code.joejag.com/2016/anti-if-the-missing-patterns.html
- John De Goes, "Destroy All Ifs: A Perspective from Functional Programming" (2016): https://degoes.net/articles/destroy-all-ifs
- Wai Lee Chin Feman, "Conditionals Aren't Evil, Unless You Duplicate Them", 8th Light (2013): https://8thlight.com/blog/wai-lee-chin-feman/2013/08/11/anti-anti-if.html
- Jay Verce, "Revisiting the Anti-IF Campaign" (2026): https://jverce.dev/posts/anti-if/
- Michael Feathers, "Unconditional Programming" (2013), not reviewed: http://michaelfeathers.typepad.com/michael_feathers_blog/2013/11/unconditional-programming.html
- Robert C. Martin, Clean Code (2008), switch statements section; quote seen at: https://www.goodreads.com/notes/6607720-clean-code/62154482-vaidas/cfdffb72-f875-4fe3-855e-52e82e43acb1
- DevIQ, Switch Statements code smell: https://hugo.deviq.com/code-smells/switch-statements/
- Elf Sternberg, review of Clean Code: https://elfsternberg.com/blog/review-clean-code-by-robert-martin/
- Casey Muratori, "Clean Code, Horrible Performance" (find the original on Computer, Enhance!; a response article, "Clean Code and Speed: Not Either/Or", is on HackerNoon)
- Thomas J. McCabe, "A Complexity Measure", IEEE Transactions on Software Engineering (1976); overview: https://en.wikipedia.org/wiki/Cyclomatic_complexity
- DevIQ, Cyclomatic Complexity: https://www.deviq.com/terms/cyclomatic-complexity/
- Linus Torvalds, TED interview "The mind behind Linux" (2016), around 14:10: https://www.ted.com/talks/linus_torvalds_the_mind_behind_linux
- mkirchner (GitHub), "Linked lists, pointer tricks and good taste": https://github.com/mkirchner/linked-list-good-taste
- John Ousterhout, A Philosophy of Software Design (2018); review by Henrik Warne: https://henrikwarne.com/2021/07/12/book-review-a-philosophy-of-software-design/
- Tcl wiki, Define Errors Out of Existence: https://wiki.tcl-lang.org/page/Define+Errors+Out+of+Existence
- Slotine and Li, Applied Nonlinear Control (1991), boundary layer sliding mode control
- "A remark on the boundedness and convergence properties of smooth sliding mode controllers": https://arxiv.org/abs/0802.2978
- Chattering and boundary layers with parasitic dynamics (ACC 2011): https://skoge.folk.ntnu.no/prost/proceedings/acc11/data/papers/0298.pdf
- Schmitt trigger overview, Wevolver: https://www.wevolver.com/article/schmitt-trigger-robust-comparator-design-with-hysteresis
