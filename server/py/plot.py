#!/usr/bin/env python
###############################################################################

import argparse, os, sys

from datetime import datetime
from matplotlib import pyplot

###############################################################################
###############################################################################

def histogram(arguments):

    data = map(float, sys.stdin.readlines())
    pyplot.hist(list(data), bins=arguments.bins)
    pyplot.grid()

    pyplot.savefig(path(arguments))

def path(arguments):
    ts = timestamp()
    ext = arguments.image_ext
    return arguments.image_tpl.format(ts, ext)

def timestamp(value=None):
    if value is None: value = datetime.now()
    return str(value).replace(' ', 'T')[:-3] + 'Z'

###############################################################################
###############################################################################

if __name__ == "__main__":

    parser = argparse.ArgumentParser(prog='Plotter',
        formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    subparsers = parser.add_subparsers()

    parser.add_argument('--image-tpl', type=str,
        default=os.environ.get('PLOT_IMAGE_TPL', 'img-[{0}].{1}'),
        help='Output image template')
    parser.add_argument('--image-ext', type=str,
        default=os.environ.get('PLOT_IMAGE_EXT', 'png'),
        help='Output image extension')

    parser_plot = subparsers.add_parser('histogram',
        help='Plots a histogram')
    parser_plot.add_argument('-n', '--bins', type=int,
        default=os.environ.get('HISTOGRAM_BINS', 10),
        help='Number of bins')
    parser_plot.set_defaults(func=histogram)

    parser.add_argument('-v', '--version', action='version',
        version='%(prog)s 0.0.1')

    args = parser.parse_args()
    if hasattr(args, 'func'):
        args.func(args)

###############################################################################
###############################################################################
