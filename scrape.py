from bs4 import BeautifulSoup
import requests

# need requests and beautiful soup installed. 


# Should get ESPN and BBC to start. is called from the post route

url = 'https://grantland.com/features/the-consequences-caring/'

page = requests.get(url)

page.text

soup = BeautifulSoup(page.text, 'html.parser')

