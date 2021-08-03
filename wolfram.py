import wolframalpha
from lxml import html

root = html.parse("index.html").getroot()
input = root.get_element_by_id("generic")
app_id = "HVQXWX-37GELV7JQG"
client = wolframalpha.Client(app_id)

res = client.query(input)
answer = next(res.results).text

root.get_element_by_id("generic") = answer
