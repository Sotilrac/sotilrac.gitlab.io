---
layout: layouts/post.njk
status: public
title: I See 0xDEADBEEF
date: 2026-03-28T12:00:00-04:00
categories:
  - Tools
tags:
  - javascript
  - web-components
---

For years I've wanted a proper programmer calculator that I can have always handy. The kind of tool you reach for when you're staring at register dumps, debugging bitfields, looking into UART lines, or trying to remember what an IEEE 754 float looks like in hex.

The options out there never quite cut it. Many people use the Windows Calculator's programmer mode, which is sad; it doesn't even support unsigned numbers, which incidentally is the [#1 most requested feature](https://github.com/microsoft/calculator/issues/66) since they open-sourced it in 2019. Plus, it's from Micro$oft 🤮.

I couldn't find web-based alternatives that aren't either too basic (just binary arithmetic), too cluttered, or missing the features that matter most: IEEE 754 floats, endianness, C-style expression input, and, most important of all, all bits and bytes must align nicely for maximum visual clarity. Oh, and it should look cool!

So, I made one.

## 0xDEADBEEF

If you're puzzled by the name, read this Peta: [Magic Numbers](<https://en.wikipedia.org/wiki/Magic_number_(programming)#Debug_value>)

<programmer-calculator></programmer-calculator>

<script src="/js/programmer-calculator.js"></script>

## How to Use It

**Expression input**: type [C-style](https://www.gnu.org/software/c-intro-and-ref/manual/html_node/Arithmetic.html) expressions with proper operator precedence. Supports `0x` (hex), `0b` (binary), and `0o` (octal) prefixes:

```
0xFF & (0x0F << 4)
0b11001000 ^ 0xFF
(0x10F << 8) | 0x2C
(0xDEAD << 16) | 0xBEEF
```

**Float to bits**: type a decimal like `3.14` and it converts to IEEE 754 bit representation. The IEEE 754 panel shows the color-coded sign, exponent, and mantissa breakdown.

**Bit grid**: click any bit to toggle it. Bits are grouped by nibble and byte for readability.

**Bit width**: switch between 8, 16, 32, and 64-bit modes. Values are clamped to the selected width.

**Signed/Unsigned**: toggle to see the same bits interpreted as signed (two's complement) or unsigned.

**Operations**: the operations panel has bitwise ops (AND, OR, XOR, NOT), shifts and rotates (with tooltips explaining each one), and byte manipulation (byte swap, bit reverse, nibble swap).

**Byte view**: see the value as bytes in big-endian and little-endian order, plus ASCII.

**Bitmask generator**: specify a bit range and get the corresponding mask.

## Features

- All four bases displayed simultaneously (HEX, DEC, OCT, BIN)
- Bit widths: 8, 16, 32, 64
- Signed and unsigned mode
- C-style expression parser with `0x`/`0b`/`0o` prefixes
- Interactive bit toggling grid
- IEEE 754 float visualization (32-bit and 64-bit)
- Endianness byte view + ASCII
- Shifts (logical, arithmetic) and rotates (left, right)
- Byte swap, bit reverse, nibble swap
- Bitmask generator
- Copy to clipboard with format prefixes
- Expression history
- Zero dependencies, runs entirely in the browser
- Works offline

## Embed It

0xDEADBEEF is a single-file Web Component with no dependencies. To embed it in your own page:

```html
<script src="https://asmat.ca/js/programmer-calculator.js"></script>
<programmer-calculator></programmer-calculator>
```

That's it. [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM) keeps styles isolated so it won't conflict with your page.

## How It's Built

The entire calculator is a single JavaScript file (~1300 lines) with no dependencies:

- **Web Component** with Shadow DOM for complete style encapsulation
- **BigInt** for correct 64-bit integer arithmetic (`BigInt.asIntN`/`asUintN` for signed/unsigned)
- **Pratt parser** for C-style expression evaluation with proper operator precedence
- **DataView** for IEEE 754 float-to-bits conversion

No framework, no build step, no dependencies to go stale, no gluten, 32g of protein. It should work as long as browsers exist.
