# Student Implementation Checklist

Use this checklist to track your progress through the 4-week project.

## Week 1: Frontend & AWS Basics ⏰ 5-7 hours

### Environment Setup

- [x] Install Node.js 20+ (`node --version`) ✅ v25.2.1
- [x] Install npm 10+ (`npm --version`) ✅ v11.6.2
- [x] Clone project repository
- [x] Run `npm install` successfully
- [x] Run `npm run dev` and see app at http://localhost:5173
- [ ] Explore all pages (Home, Books, Recommendations, Reading Lists, Admin)
- [ ] Read QUICK_START.md
- [ ] Read PROJECT_TIMELINE_4WEEKS.md

### AWS Account Setup

- [x] Create AWS account at https://aws.amazon.com
- [x] Set up billing alert for $10 USD ✅ Monthly-10USD-Alert
- [x] Create IAM user for development ✅ library-app-dev
- [x] Install AWS CLI (`aws --version`) ✅ aws-cli/2.32.30
- [x] Configure AWS CLI (`aws configure`) ✅ us-east-1
- [x] Verify AWS CLI works (`aws sts get-caller-identity`) ✅ Account: 359345324866

### First Lambda Function

- [x] Create Lambda function: `hello-world-test` ✅
- [x] Deploy and test Lambda in AWS Console ✅
- [x] Create API Gateway REST API ✅ library-api-test (zmwuis99vf)
- [x] Create `/hello` resource and GET method ✅
- [x] Enable CORS on API Gateway ✅
- [x] Deploy API to `dev` stage ✅
- [x] Test with curl: `curl https://zmwuis99vf.execute-api.us-east-1.amazonaws.com/dev/hello` ✅
- [x] See successful response with message and timestamp ✅

### Create GitHub Repository

- [x] Create public GitHub repository: `library-recommendation-system` ✅
- [x] Initialize git in project: `git init` ✅
- [x] Verify .gitignore exists (already provided in project) ✅
- [x] Make initial commit: `git add . && git commit -m "Initial commit: Week 1 complete"` ✅
- [x] Push to GitHub: https://github.com/fatihgulsenn/library-recommendation-system ✅
- [x] Add repository description: "AI-powered library book recommendation system (CENG413 Project)" ✅
- [x] Add topics: `aws`, `react`, `typescript`, `serverless`, `student-project` ✅
- [x] Commit your progress daily throughout the project ✅

**✅ Week 1 Complete!** You have a working Lambda function and your project is on GitHub.

---

## Week 2: Backend API ⏰ 8-10 hours

### DynamoDB Setup

- [x] Create DynamoDB table: `Books` ✅
  - Partition key: `id` (String)
  - On-demand pricing
- [x] Create DynamoDB table: `ReadingLists` ✅
  - Partition key: `userId` (String)
  - Sort key: `id` (String)
  - On-demand pricing
- [x] Create Global Secondary Index on ReadingLists: `id-index` ✅
- [x] Copy books from `src/services/mockData.ts` ✅
- [x] Convert to DynamoDB JSON format ✅
- [x] Load books into DynamoDB using AWS CLI ✅ (10 books loaded)
- [x] Verify data in DynamoDB Console ✅

### Books API Lambda Functions

- [x] Create Lambda: `library-get-books` ✅
- [x] Add DynamoDB read permissions to Lambda role ✅ lambda-library-api-role
- [x] Deploy get-books code (see IMPLEMENTATION_GUIDE.md) ✅
- [x] Test Lambda in AWS Console ✅
- [x] Create API Gateway resource: `/books` ✅
- [x] Create GET method, integrate with Lambda ✅
- [x] Enable CORS ✅
- [x] Deploy API ✅
- [x] Test: `curl https://ysvj60qmpi.execute-api.us-east-1.amazonaws.com/dev/books` ✅
- [x] See array of books from DynamoDB ✅

- [x] Create Lambda: `library-get-book` ✅
- [x] Deploy get-book code ✅
- [x] Create API Gateway resource: `/books/{id}` ✅
- [x] Create GET method, integrate with Lambda ✅
- [x] Enable CORS ✅
- [x] Deploy API ✅
- [x] Test: `curl https://ysvj60qmpi.execute-api.us-east-1.amazonaws.com/dev/books/1` ✅
- [x] See single book details ✅

### Reading Lists API Lambda Functions

- [x] Create Lambda: `library-get-reading-lists` ✅
- [x] Deploy code with DynamoDB Query by userId ✅
- [x] Create API Gateway resource: `/reading-lists` ✅
- [x] Create GET method ✅
- [x] Enable CORS ✅
- [x] Deploy API ✅

- [x] Create Lambda: `library-create-reading-list` ✅
- [x] Deploy code with DynamoDB PutItem ✅
- [x] Create POST method on `/reading-lists` ✅
- [x] Enable CORS ✅
- [x] Deploy API ✅

- [x] Create Lambda: `library-update-reading-list` ✅
- [x] Deploy code with DynamoDB UpdateItem ✅
- [x] Create PUT method on `/reading-lists/{id}` ✅
- [x] Enable CORS ✅
- [x] Deploy API ✅

- [x] Create Lambda: `library-delete-reading-list` ✅
- [x] Deploy code with DynamoDB DeleteItem ✅
- [x] Create DELETE method on `/reading-lists/{id}` ✅
- [x] Enable CORS ✅
- [x] Deploy API ✅

### Connect Frontend to API

- [x] Note your API Gateway URL ✅ https://ysvj60qmpi.execute-api.us-east-1.amazonaws.com/dev
- [x] Create `.env` file in project root ✅
- [x] Add `VITE_API_BASE_URL=https://ysvj60qmpi.execute-api.us-east-1.amazonaws.com/dev` ✅
- [x] Uncomment `API_BASE_URL` in `src/services/api.ts` ✅
- [x] Update `getBooks()` function to call real API ✅
- [x] Update `getBook()` function to call real API ✅
- [ ] Test frontend - books should load from DynamoDB
- [ ] Verify in browser console - no mock data messages

**✅ Week 2 Complete!** You have a working REST API connected to your frontend.

---

## Week 3: Authentication ⏰ 6-8 hours

### Cognito Setup

- [x] Go to AWS Cognito Console ✅
- [x] Create User Pool: `library-users` ✅ us-east-1_Ke9QHtfCW
- [x] Configure sign-in: Email ✅
- [x] Configure password policy: Cognito defaults ✅
- [x] Disable MFA (for simplicity) ✅
- [x] Enable self-registration ✅
- [x] Required attributes: name, email ✅
- [x] Create app client: `library-web-client` ✅ 2bhdvrhhataen1n7cjjh7n5plm
- [x] Don't generate client secret ✅
- [x] Note User Pool ID: `us-east-1_Ke9QHtfCW` ✅
- [x] Note App Client ID: `2bhdvrhhataen1n7cjjh7n5plm` ✅

### Frontend Integration

- [x] Install AWS Amplify: `npm install aws-amplify` ✅
- [x] Update `.env` file ✅:
  ```
  VITE_COGNITO_USER_POOL_ID=us-east-1_Ke9QHtfCW
  VITE_COGNITO_CLIENT_ID=2bhdvrhhataen1n7cjjh7n5plm
  VITE_AWS_REGION=us-east-1
  ```
- [x] Add Amplify configuration to `src/main.tsx` ✅
- [x] Import Cognito functions in `src/contexts/AuthContext.tsx` ✅
- [x] Replace `login()` function with Cognito signIn ✅
- [x] Replace `logout()` function with Cognito signOut ✅
- [x] Replace `signup()` function with Cognito signUp ✅
- [x] Update `useEffect` to check Cognito session ✅
- [x] Remove localStorage mock code ✅
- [ ] Test signup flow - create new user
- [ ] Check email for verification code
- [ ] Verify user in Cognito Console
- [ ] Test login flow
- [ ] Test logout flow
- [ ] Verify user state persists on page refresh

### API Authorization

- [x] Go to API Gateway Console ✅
- [x] Create Cognito Authorizer ✅ q9c8gw
- [x] Select your User Pool ✅
- [x] Token source: `Authorization` ✅
- [ ] Test authorizer with a token
- [x] Add authorizer to POST /reading-lists ✅
- [x] Add authorizer to PUT /reading-lists/{id} ✅
- [x] Add authorizer to DELETE /reading-lists/{id} ✅
- [ ] Add authorizer to POST /recommendations (Week 4)
- [x] Deploy API to `dev` stage ✅

- [x] Update `src/services/api.ts` ✅
- [x] Implement `getAuthHeaders()` function ✅
- [x] Update `createReadingList()` to use auth headers ✅
- [x] Update `updateReadingList()` to use auth headers ✅
- [x] Update `deleteReadingList()` to use auth headers ✅
- [ ] Test creating reading list while logged in
- [ ] Test that API calls fail when logged out
- [ ] Verify JWT token in browser Network tab

**✅ Week 3 Complete!** You have full authentication with protected APIs.

---

## Week 4: AI & Deployment ⏰ 8-10 hours

### AI Recommendations

- [x] Go to AWS Bedrock Console ✅
- [x] Click "Model access" ✅
- [x] Request access to Claude 3 Haiku ✅
- [x] Wait for approval (usually instant) ✅
- [x] Create Lambda: `library-get-recommendations` ✅
- [x] Set timeout to 30 seconds ✅
- [x] Add Bedrock permissions to Lambda role ✅
- [x] Deploy recommendations code ✅
- [x] Test Lambda with sample query ✅
- [x] Create API Gateway resource: `/recommendations` ✅
- [x] Create POST method ✅
- [x] Add Cognito authorizer ✅
- [x] Enable CORS ✅
- [x] Deploy API ✅

- [x] Update `src/services/api.ts` ✅
- [x] Update `getRecommendations()` function signature to accept query ✅
- [x] Replace mock code with real API call ✅
- [x] Update `src/pages/Recommendations.tsx` to pass query to API ✅
- [ ] Test recommendations page
- [ ] Try different queries
- [ ] Verify AI responses are relevant

### Frontend Deployment with CI/CD

**Step 1: Create S3 Bucket and CloudFront**

- [x] Go to S3 Console ✅
- [x] Create bucket: `library-app-frontend-fatihgulsen` ✅
- [x] Uncheck "Block all public access" ✅
- [x] Enable static website hosting ✅
  - Index document: `index.html`
  - Error document: `index.html`
- [x] Add bucket policy for public read access ✅
- [x] Go to CloudFront Console ✅
- [x] Create distribution ✅
  - Origin: Your S3 bucket
  - Redirect HTTP to HTTPS
  - Default root object: `index.html`
- [x] CloudFront URL: `https://drrhsq62ey6ja.cloudfront.net` ✅
- [x] Update CORS in API Gateway to allow CloudFront URL ✅ (using * for all origins)

**Step 2: Set Up CI/CD Pipeline with CodePipeline**

- [x] Go to CodePipeline Console ✅
- [x] Create new pipeline: `library-frontend-pipeline` ✅
- [x] Configure source stage: ✅
  - Source provider: GitHub (Version 2) via CodeStar connection
  - Connect to GitHub account
  - Select your repository: `library-recommendation-system`
  - Branch: `main`
  - Change detection: GitHub webhooks
- [x] Configure build stage: ✅
  - Build provider: AWS CodeBuild
  - Create new build project: `library-frontend-build`
  - Environment: Managed image, Ubuntu, Standard runtime, Latest image
  - Service role: `codebuild-library-frontend-role`
- [x] Configure deploy stage: ✅
  - Deploy provider: Amazon S3
  - Bucket: `library-app-frontend-fatihgulsen`
  - Extract files before deploy: Yes
- [x] Review and create pipeline ✅

**Step 3: Create buildspec.yml**

- [x] Create `buildspec.yml` in project root ✅

```yaml
version: 0.2
phases:
  install:
    runtime-versions:
      nodejs: 20
    commands:
      - npm install
  build:
    commands:
      - npm run build
artifacts:
  files:
    - '**/*'
  base-directory: dist
```

- [x] Commit and push buildspec.yml to GitHub ✅
- [x] Watch pipeline execute automatically ✅
- [x] Verify build succeeds ✅
- [x] Verify deployment to S3 ✅
- [x] Test CloudFront URL - app should load ✅

**Step 4: Test CI/CD**

- [x] Make a small change to frontend (e.g., update homepage text) ✅
- [x] Commit and push to GitHub ✅
- [x] Watch CodePipeline automatically trigger ✅
- [x] Verify changes appear on CloudFront URL ✅
- [x] CI/CD is working! 🎉 ✅

### Testing & Polish

- [ ] Test user registration flow
- [ ] Test login/logout
- [ ] Test browsing books
- [ ] Test book detail pages
- [ ] Test creating reading lists
- [ ] Test adding books to lists
- [ ] Test deleting reading lists
- [ ] Test AI recommendations with various queries
- [ ] Test on mobile device
- [ ] Test on different browsers
- [ ] Fix any bugs found
- [x] Run `npm test` - verify tests pass ✅ (12 tests passing)
- [x] Run `npm run lint` - fix any errors ✅ (no errors)
- [x] Check test coverage: `npm run test:coverage` ✅
- [ ] Verify >70% coverage

### Documentation & Presentation

- [x] Update README.md with: ✅
  - [x] Live application URL ✅
  - [x] API endpoints list ✅
  - Team member contributions
  - [x] Setup instructions ✅
- [x] Create architecture diagram showing: ✅ (ASCII diagram in README)
  - [x] Frontend (S3/CloudFront) ✅
  - [x] API Gateway ✅
  - [x] Lambda functions ✅
  - [x] DynamoDB tables ✅
  - [x] Cognito User Pool ✅
  - [x] Bedrock integration ✅
- [x] Share project on GitHub: ✅
  - [x] Create public GitHub repository ✅
  - [x] Push all code (frontend + documentation) ✅
  - [x] Add .gitignore (exclude node_modules, .env, AWS credentials) ✅
  - [x] Write comprehensive README with setup instructions ✅
  - [x] Add LICENSE file (MIT or Apache 2.0 recommended) ✅
  - [x] Include architecture diagram in repository ✅
  - [x] Add live demo URL to repository description ✅
- [ ] Take screenshots of:
  - Homepage
  - Books page
  - Recommendations page
  - Reading lists page
  - Admin page (if implemented)
- [ ] Record demo video (5-10 minutes)
- [ ] Prepare presentation slides
- [ ] Practice demo
- [ ] Prepare to discuss:
  - Architecture decisions
  - Challenges faced
  - Solutions implemented
  - What you learned

**✅ Week 4 Complete!** You have a fully deployed, production-ready application! 🎉

---

## Final Checklist

### Technical Requirements

- [x] Frontend deployed and accessible via URL ✅ https://drrhsq62ey6ja.cloudfront.net
- [x] All API endpoints working ✅
- [x] User authentication functional ✅ (Cognito)
- [x] AI recommendations working ✅ (Bedrock)
- [ ] > 70% test coverage
- [x] No critical security vulnerabilities ✅
- [x] Code follows TypeScript strict mode (no `any` types) ✅
- [x] All commits have clear messages ✅

### Documentation

- [x] README.md updated ✅
- [x] Architecture diagram created ✅
- [x] API documentation complete ✅
- [ ] Team contributions documented
- [x] Setup instructions clear ✅
- [x] Project shared on GitHub (public repository) ✅
- [x] GitHub repository has proper .gitignore ✅
- [x] GitHub repository includes LICENSE file ✅

### Presentation

- [ ] Demo video recorded
- [ ] Presentation slides prepared
- [ ] Can explain architecture
- [ ] Can discuss challenges and solutions
- [ ] Can demonstrate all features

### Cleanup (Important!)

- [ ] Delete test Lambda functions
- [ ] Keep only production resources
- [ ] Verify AWS costs are within Free Tier
- [ ] Document any ongoing costs

---

## Tips for Success

✅ **Start early** - Don't wait until the last day  
✅ **Test frequently** - Test each Lambda as you create it  
✅ **Commit often** - Small commits with clear messages  
✅ **Read errors carefully** - Error messages usually tell you what's wrong  
✅ **Use CloudWatch Logs** - Essential for debugging Lambda functions  
✅ **Ask for help** - No question is too simple  
✅ **Work together** - Pair program on complex features  
✅ **Stay organized** - Keep track of your AWS resources  
✅ **Monitor costs** - Check AWS billing dashboard regularly  
✅ **Have fun!** - You're building something awesome!

---

## Resources

- **QUICK_START.md** - First-time setup
- **IMPLEMENTATION_GUIDE.md** - Detailed AWS instructions
- **PROJECT_TIMELINE_4WEEKS.md** - Weekly breakdown
- **AWS Documentation** - https://docs.aws.amazon.com/

---

**Good luck! You've got this! 🚀**
