# Voting Application

## What are we building

A functionality where user can give vote to the given set of electors.

Models ?
Routes ?

Functionality 

1. user sign in / sign up 
2. see the list of electors 
3. vote one of the electors , after voting user can't vote again
4. there is a route which shows the list of electors and their live vote counts sorted by their vote count
5. user data must contain their one unique govt id proof named : aadhar card number
 user can login only with aadhar card number and password.
6. there should be one admin who can only maintain the table of electors and he can't able to vote at all.
7. user can change the password
8. Admin can't vote


==============================================================

Routes :- 

User Authentication:

```/signup```: POST - create a new user account.

```/login``` : POST - Log in to an existing account. [aadhar card number + password]

Voting:

```/electors``` : GET - Get the list of electors 
    
```/vote/:electorId``` : POST - Vote for a specific candidate. 

Vote Counts:

```/vote/counts``` : GET - Get the list of electors sorted by their vote counts.

User Profile:

```/profile``` : GET - Get the user's profile information

```/profile/password``` : PUT - Change the user's password

Admin Candidate Management :

```/electors```: POST - Create a new candidate.

```/electors/:electorId``` : PUT - Update an existing candidate.

```/electors/:electorId``` : DELETE - Delete a electors from the list.