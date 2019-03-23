# TypeScript Node Starter


The main purpose of this repository is to show a good end-to-end project setup and workflow for writing Node code in TypeScript.
I will try to keep this as up-to-date as possible, but community contributions and recommendations for improvements are encouraged and will be most welcome. 


# Pre-reqs
To build and run this app locally you will need a few things:
- Install [Node.js](https://nodejs.org/en/)
- Install [MongoDB](https://docs.mongodb.com/manual/installation/)
- Install [VS Code](https://code.visualstudio.com/)

# Getting started
- Clone the repository
```
git clone https://github.com/clbku/typescript-express-starter.git <project_name>
```
- Install dependencies
```
cd <project_name>
npm install
```
- Configure your mongoDB server
```bash
# create the db directory
sudo mkdir -p /data/db
# give the db correct read/write permissions
sudo chmod 777 /data/db
```
- Start your mongoDB server (you'll probably want another command prompt)
```
mongod
```
- Build and run the project
```
npm run build
npm start
```
Or, if you're using VS Code, you can use `cmd + shift + b` to run the default build task (which is mapped to `npm run build`), and then you can use the command palette (`cmd + shift + p`) and select `Tasks: Run Task` > `npm: start` to run `npm start` for you.