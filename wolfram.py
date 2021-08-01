import wolframalpha

input = raw_input(" ")
app_id = "HVQXWX-37GELV7JQG"
client = wolframalpha.Client(app_id)

res = client.query(input)
answer = next(res.results).text

print answer
