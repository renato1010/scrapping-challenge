# Request Header Challenge

This project is setup with a frontend codebase using React, Typescript, and Tailwind.

The backend is setup using Typescript, Express, and Mongoose.

The idea is to test a small full stack problem in the vein of the work we do. While none of this is technically hard, we want to see how you handle both the interface and backend work. 

### Run MongoDB
`docker run --name hs-challenge -p 27017:27017 -d mongo`


### Install the project
`npm i`


### Start the frontend and backend
`npm run dev`

Challenge:

1. Build a form to take as it's input a target URL and record it into the database.
  - Validate that URL is a FQDN, and show an error message if not.
  - Give some indication in the UI when successfully submitting.

2. Once a target has been received by the backend, run some checks on the headers and response returned by the website:
  - Required: Is an x-frame-options security header setup and secure?
  - Required: Is HSTS setup and secure?
  - Required: Do either the headers or the page contain a CSP policy? Does the CSP appear relatively secure?
  - Optional, time willing: Does the page serve using a correctly signed SSL certificate? (https://badssl.com/ can be useful for testing, not all cases need handling but error catching would be good)

3. Upon completing the checks, record the results to the database.

4. Render the results on the page for each target domain and result set that has been scanned. If one of the checks fails, flag this as an issue in the interface for the end user to notice.

A couple of notes:
- Please use whatever additional libraries or tools you'd prefer to get the job done.
- We're not worried about having a responsive design. Desktop only.
- No need to build out anything else not related to the challenge. No need for accounts or authentication, etc.
- We're not concerned about building this in a scalable way. However, errors that might be thrown should be handled appropriately and rendered to the frontend.
