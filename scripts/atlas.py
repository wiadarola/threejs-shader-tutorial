from PIL import Image

def merge(im1, im2):
    w = im1.size[0] + im2.size[0]
    h = max(im1.size[1], im2.size[1])
    im = Image.new("RGBA", (w, h))

    im.paste(im1)
    im.paste(im2, (im1.size[0], 0))

    return im

imArr = [
    Image.open("./textures/facebook.png"),
    Image.open("./textures/globe.png"),
    Image.open("./textures/home.png"),
    Image.open("./textures/mushroom.png"),
    Image.open("./textures/paper.png"),
    Image.open("./textures/phone.png"),
    Image.open("./textures/point.png"),
    Image.open("./textures/user.png"),
    Image.open("./textures/plane.png")
]

atlas1 = merge(imArr[0], imArr[1])
for i in range(2, 4):
    atlas1 = merge(atlas1, imArr[i])
atlas1 = atlas1.transpose(Image.Transpose.ROTATE_90)

atlas2 = merge(imArr[4], imArr[5])
for i in range(6, len(imArr)):
    atlas2 = merge(atlas2, imArr[i])
atlas2 = atlas2.transpose(Image.Transpose.ROTATE_90)

atlas3 = merge(atlas1, atlas2)
atlas3 = atlas3.transpose(Image.Transpose.ROTATE_270)

#atlas3.show()
atlas3.save("atlasBox.png")

