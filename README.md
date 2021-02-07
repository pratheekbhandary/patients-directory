# PatientsDirectory
Innovacer project

To run the app:
  ```
     //clone 
     
     cd storage
     make up
     
     cd backend
     /* .env has been added 
     yarn
     yarn start
     
     cd frontend
     /* .env has been added 
     yarn
     yarn start
     // app should be available @ http://localhost:3000/
  ```

### Tasks completed
- [x] TypeScript
- [x] DB is dockerized
#### Frontend
 - [x] Patient creation using upload
 - [x] Patient table
     - [x] Click will redirect to Patient Profile
     - [x] Sorting table columns
     - [x] Pagination
        <details>
          <summary>Please note</summary>
          Just by reading Test problem disccription, I thought the requirement is to implement server side pagination, but components provided by "Innovaccer design system component",
          I was not able to get access to `totalCount` using Sync table. Hence I have kinda implemented client side pagination.
        </details>
      - [x] Search Feature
         <details>
          <summary>Please note</summary>
          Have implemented server-side search, but not used.
         </details>
    - [x] Patient profile
       - [x] URL access
  
  #### Backend
   - [x] APIs
        - [x] URL: /patients
             Method: GET
             Response: List of patients.
             Additionally pagination and search
        - [x] URL: /patients
             Method: POST
             Response: Success or failure message.
             Payload: csv/excel file.
        - [x] URL: /patients/<PATIENT_ID>
             Response: Patient details.
### Tasks Pending
  - [ ] Test cases
  - [ ] Dockerizing backend and front end
  - [ ] Deployment 
