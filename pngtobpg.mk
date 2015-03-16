# Download a PNG tileset and convert to BPG
# Run with `make -f pngtobpg.mk -j <number of processes>'

# The zoom level at which x0, x1, y0 and y1 are valid
z = 16
x0 = 36584
x1 = 36596
y0 = 21624
y1 = 21648

# Min and max zoom level
z0 = 5
z1 = 18

pnglayer = http://c.tile.openstreetmap.pl/osmapa.pl

define pyscript
import itertools
for tz in range($(z0), $(z1) + 1):
 f = 2 ** (tz - $(z))
 for tx, ty in itertools.product(range(int($(x0) * f), int($(x1) * f + 1)), range(int($(y0) * f), int($(y1) * f + 1))): print(str(tz) + "/" + str(tx) + "/" + str(ty) + ".bpg")
endef
tiles = $(shell python -c '$(pyscript)')
all: $(tiles)

summary:
	@echo Total PNGs size
	@ls -l */*/*.png | awk '{ total += $$5 }; END { print total }'
	@echo Total BPGs size
	@ls -l */*/*.bpg | awk '{ total += $$5 }; END { print total }'

%.bpg: %.png
	bpgenc -m 9 -q 32 -o $@ $<
%.png:
	@mkdir -p `dirname $@`
	wget --quiet -O $@ $(pnglayer)/$@
.SECONDARY:
