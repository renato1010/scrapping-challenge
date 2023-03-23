# Challenge

## Requirements

1. Build a form to take as it's input a target URL and record it into the database.

- Validate that URL is a FQDN, and show an error message if not.
- Give some indication in the UI when successfully submitting.

✅ Validate for both **FQDN** and **full URL** with some custom options

[custom validation](packages/frontend/src/utilities/validation.ts);

```ts
const customUrlValidation = (target: string) => {
  return isURL(target, { protocols: ["https"], require_protocol: true });
};
```

[validation at form component](packages/frontend/src/components/scan-form.tsx)

```ts
const validateURL = useCallback(() => {
  try {
    const fullURL = new URL(url);
    const fqdnError = isFQDN(fullURL.hostname) ? null : "No fully qualified domain name";
    const urlError = customUrlValidation(url) ? null : "No valid URL";
    validationHandler({ fqdnError, urlError });
  } catch (error) {
    const fqdnError = isFQDN(url) ? null : "No fully qualified domain name";
    validationHandler({ fqdnError, urlError: "No valid URL" });
  }
}, [url]);
```

<div align="center">
<p>Form validation</p>
<img src="https://losormorpino-public-media.s3.us-east-2.amazonaws.com/0u00n15.gif" width="800" alt="frontend validation">
</div>

2. Once a target has been received by the backend, run some checks on the headers and response returned when making a request to the target:

- _Required:_ Is an x-frame-options security header setup and secure?
- _Required:_ Is HSTS setup and secure?
- _Required:_ Do either the headers or the page contain a CSP policy? Does the CSP appear relatively secure?
- _Optional, time willing:_ Does the page serve using a correctly signed SSL certificate? (https://badssl.com/ can be useful for testing, not all cases need handling but error catching would be good)

✅ Validate URL on backend side, tested used command line call

<div align="center">
<br>
<br>
<p>Backend validation(console call)</p>
  <img src="https://losormorpino-public-media.s3.us-east-2.amazonaws.com/mu0059g.gif" width="800" alt="backend validation">
</div>

✅ Scraping target url and looking for headers "x-frame-options", "strict-transport-security", "content-security-policy"

This was done in a specific **Middleware** at: [check security headers middleware](packages/backend/src/middlewares/scraping-secure-headers.ts)

**Notes:**

- strict-transport-security: The criterion for qualifying this heading as insurance was that the maximum age was greater than one year.
- x-frame-options: only presence
- content-security-policy: OK if have more than two of directives("default-src", "script-src", "img-src")

**All these checks are added to the "request" object**

```ts
const asyncHeadersScraping = async (req: RExtended, _res: Response, next: NextFunction) => {
  const { url } = req.body;
  const { headers } = await gotScraping(url);
  req.secureHeaders = getSecureHeaders(headers);
  next();
};
```

❌ Not check the "correct signed SSL certificate by target URL"

3. Upon completing the checks, record the results to the database.

When runtime get to the **"/scan"** path handler, it's already guaranteed that url validation and safe headers are already embedded on the request object, so all that's left is to add some extra data and then call the **"inserOne"** collection method  
["/scan" route handler](packages/backend/src/index.ts)

```ts
app.post("/scan", [validateUrl, asyncHeadersScraping], async (req: RExtended, res: Response) => {
  let securityHeaders = req.secureHeaders ?? {};
  let { url } = req.body;
  const insertData: URLScans = { ...securityHeaders, createdAT: new Date(), url };
  const savedData = await scansCollection.insertOne(insertData);
  if (savedData.acknowledged) {
    res.status(200).json({ ok: true, statusCode: 200, data: securityHeaders || null });
  } else {
    throw new Error("Error saving scan data");
  }
});
```

✅ Verifying data stored in the challenge collection (MongoDB Compass)

<div align="center">
<br>
<br>
<p>MongoDB Compass data saved</p>
  <img src="https://losormorpino-public-media.s3.us-east-2.amazonaws.com/e500bv6.png" width="800" alt="MongoDB Compass data saved">
</div>

4. Render the results on the page for each target domain and result set that has been scanned. If one of the checks fails, flag this as an issue in the interface for the end user to notice.

✅ Show the result of **secure headers scraping** in the frontend

<div align="center">
<br>
<br>
<p>Show secure headers in frontend</p>
  <img src="https://losormorpino-public-media.s3.us-east-2.amazonaws.com/gx00xd5.gif" width="800" alt="MongoDB Compass data saved">
</div>
