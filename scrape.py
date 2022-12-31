from bs4 import BeautifulSoup
import requests

# need requests and beautiful soup installed. 


# Should get ESPN and BBC to start. is called from the post route

url = 'https://grantland.com/features/the-consequences-caring/'

page = requests.get(url)

page.text

soup = BeautifulSoup(page.text, 'html.parser')


# grantland: element = soup.select_one('.article-body') // elent.get_text()
def espn_scrape(url):
    """ Returns the article text from a url with the grantland domain """
    page = requests.get(url)
    page.text
    soup = BeautifulSoup(page.text, 'html.parser')
    story = soup.select_one('.article-body').get_text()

    return story

def grantland_scrape(url):
    """ Returns the article text from a url with the grantland domain """
    page = requests.get(url)
    page.text
    soup = BeautifulSoup(page.text, 'html.parser')
    story = soup.select_one('.article-body').get_text()

    return story

# politico: 
def politico_scrape(url):
    """ Returns the article text from a url with the politico domain """
    page = requests.get(url)
    page.text
    soup = BeautifulSoup(page.text, 'html.parser')
    story_text = soup.select('.story-text')

    final_text = " "
    for i in story_text:
       final_text = final_text + i.get_text()

    return final_text 

# def ringer_scrape(url):
#     """ Returns the article text from a url with the ringer domain """

#     page = requests.get(url)
#     page.text
#     soup = BeautifulSoup(page.text, 'html.parser')
#     story_text = soup.select('.c-entry-content').get_text() 

#     return story_text


    


    