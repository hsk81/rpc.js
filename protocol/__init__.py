import imp
import inspect
import os

file = inspect.getfile(inspect.currentframe())
path = os.path.dirname(os.path.abspath(file))

for path, _, names in os.walk(path):
    for name in filter(lambda n: n.endswith('_pb2.py'), names):
        mod_name, ext = os.path.splitext(name)
        mod_path = os.path.join(path, name)
        mod = imp.load_source(mod_name, mod_path)
        locals()[mod_name] = mod

del locals()['file']
del locals()['ext']
del locals()['imp']
del locals()['inspect']
del locals()['names']
del locals()['name']
del locals()['mod_name']
del locals()['mod_path']
del locals()['mod']
del locals()['os']
del locals()['path']
del locals()['_']
