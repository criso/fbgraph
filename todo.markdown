########### 
# Next
###########
 - finish porting the vows test
 - commit 
 - start on post api








# ON code
Mimic this:
- https://developers.facebook.com/docs/reference/javascript/

- assume we have a valid access token  and go from there for now
    - set the access token using everyauth
    - use setAccessToken()
    - on request if accessToken isn't set, we should get one

# Test 
# GET
  - api.get > done
    - no access token > done
    - access token > done
      - get > done
      - search  > done

# POST
  - Post api (facebook publishing) - http://developers.facebook.com/docs/reference/api/
    You can publish to the Facebook graph by issuing HTTP POST requests to the appropriate 
    connection URLs, using an access token. For example, you can post a new wall post on 
    Arjun's wall by issuing a POST request to https://graph.facebook.com/arjun/feed
    - graph.post

# DELETE
  DELETE https://graph.facebook.com/ID?access_token=... HTTP/1.1

# BATCH requests -  
  https://developers.facebook.com/docs/reference/api/batch/

# INSIGHTS  (nice to have)

