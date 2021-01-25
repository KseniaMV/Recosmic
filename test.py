#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals
import gimp
from gimp import pdb
import gimpfu
import gimpenums

def guidesss (customtext, font, size):
    img = gimp.Image (1, 1, RGB)
    layer = pdb.gimp_text_fontname (img, None, 0, 0, customtext, 10, True, size, PIXELS, font)
    img.resize (layer.width, layer.height, 0, 0)
    gimp.Display (img)
    gimp.displays_flush ()

_plugin_help = (
  "If the sum of the specified percentages is higher than 100, one or both "
  "of the percentages are automatically adjusted to prevent color inversion "
  "(e.g. 70% black clip and 40% white clip is executed as 60% black "
  "and 40% white clip).")

gimpfu.register(
  proc_name="guidesss",
  blurb=("no one"),
  help="SSSThe drawable can be a layer, layer mask or a channel.\n",
  author="k",
  copyright="k",
  date="2010",
  label="<Image>/Colors/Gi Sss...",
  imagetypes="RGB*, GRAY*",
  params=[
    (gimpfu.PF_STRING, "customtext", "Text string", 'Scripting is handy!'),
    (gimpfu.PF_FONT, "font", "Font", "Sans"),
    (PF_SPINNER, "size", "Font size", 100, (1, 3000, 1))],
  results=[],
  function=plugin_guidesss)

#===============================================================================

if __name__ == "__main__":
  gimpfu.main()
