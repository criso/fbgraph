########### 
# Next
###########

- npm package setup

- Get Access Token (same way as js sdk)
  - if user has previously connected, we should be able to 
  get the access token

- Oauth won't be handled by the api (leave that for oauth package)




# ON code
Mimic this:
- https://developers.facebook.com/docs/reference/javascript/

- assume we have a valid access token  and go from there for now
    - set the access token using everyauth
    - use setAccessToken()
    - on request if accessToken isn't set, we should get one
