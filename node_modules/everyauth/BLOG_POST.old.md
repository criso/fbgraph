One of the issues I had with existing `connect` auth solutions is 
that you were limited by the configuration options available to you,
and the things I wanted to configure were more granular than for what
the configuration options were built.

Another issue I had with existing solutions is that the authorization
logic that you care about (i.e., the authorization steps) is spread out
across multiple locations in multiple files. Because of this and the
asynchronous callback-based approach (vs promise based), it is not as
easy to read and understand where to make modifications if you need to.

Dealing with these issues and anticipating that others might deal with them, too,
inspired me to write `everyauth`.

With `everyauth`, you can

- Add configurable parameters
- View, configure, and manipulate the default steps of an authorization strategy
  
  `everyauth` is built around the concept of steps that you declare and define. 
  So you can over-ride existing steps, add new steps, and manipulate 
  the order of steps in a straightforward easy-to-read and easy-to-write manner.
  
- Easily define your own strategies just the way you have them in mind.
- All the logic for an authorization strategy is always in one place.
