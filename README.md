# Next steps
We are missing things like :
- Error handling (better one)
- Request input sanitazation (with Yup or something similar)
https://www.npmjs.com/package/yup
- Secret management! (and config with dotenv)

# Design

![design](https://github.com/emilhotkowski/sample-app-blue/tree/main/images/blue.png)

- _Authorization module_ is responsible for authentication, authorization, registration and anything related to user management.
- _User module_ is responsible for searching patients, their medical history, adding new diagnosis etc. (Could be easily rename to Patient module)
- _Time Management module_ is responsible for management of nurses calendar like adding planned meetings and searching for available nurses for scheduled and instant called based on time and location criteria. 
