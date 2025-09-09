# Secuderm API

## Installation

1. Clone the repository  

-  Using SSH:
```bash
git clone git@github.com:Secuderm/api.git
```
- Using HTTPS:
```bash
git clone https://github.com/Secuderm/api.git
```

2. Install dependencies
```bash
yarn install
```

3. Create a `.env` file
```bash
cp .env.example .env
```

4. Compile and run the project
```bash
# development
yarn run start

# watch mode
yarn run start:dev

# production mode
yarn run start:prod

# test (need to have docker running)
yarn run test:e2e
```
