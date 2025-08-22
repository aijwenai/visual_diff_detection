from PIL import Image

# Create a simple black image
img1 = Image.new('RGB', (100, 100), color = 'black')
img1.save('backend/tests/test_images/image1.png')

# Create a simple white image
img2 = Image.new('RGB', (100, 100), color = 'white')
img2.save('backend/tests/test_images/image2.png')
