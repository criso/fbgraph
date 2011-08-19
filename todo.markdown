>- test all links related to **open** graph api 
>- test missing slash 

>- Tests that require access token 
>  '/me/friends'

- assume we have a valid access token  and go from there for now
    - set the access token using everyauth
    - use setAccessToken()
    - on request if accessToken isn't set, we should get one

>- Add Search
  >- All public posts: https://graph.facebook.com/search?q=watermelon&type=post
  >- search takes a query and options

>  - Places: https://graph.facebook.com/search?q=coffee&type=place&center=37.76,122.427&distance=1000

- Post api
  graph.post
