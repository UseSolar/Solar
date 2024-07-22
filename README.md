## About Us

This is StarLight, A web proxy that has many features.

Our goal is to make StarLight fast and easy to use, deploy & customize.

## Our Features

- Tab Cloaking
- Fast & Easy to Use
- Password Protection (in [p.js](https://github.com/GoStarLight/StarLight/blob/main/p.js))
- Ad Free
- Mobile Support 

# Deploy Options

> [!IMPORTANT]  
> If you forked this repo, Please ⭐️ this one!

## Console

```
git clone https://github.com/GoStarLight/StarLight
cd StarLight
npm install
npm start
```

## Github Codespace

1. Make a Github Account
2. Press the green "code" button
3. press the blue "create codespace on main" button
4. run the following

```
npm i
npm start
```

## Docker File

```docker build -t starlight .
docker run -p 8080:8080 --name starlight_container
starlight
```

<div style="display: flex;">
    <a href="https://render.com/deploy?repo=https://github.com/GoStarLight/StarLight">
        <img src="https://render.com/images/deploy-to-render-button.svg" alt="Deploy to Render" />
    </a>
    <a href="https://app.koyeb.com/deploy?type=git&builder=buildpack&repository=github.com/koyeb/example-nestjs&branch=main&name=nestjs-on-koyeb">
        <img src="https://www.koyeb.com/static/images/deploy/button.svg" alt="Deploy to Koyeb" />
    </a>
    <a href="https://deploy.heroku.com/?repo=https://github.com/GoStarLight/StarLight">
        <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy to Heroku" />
    </a>
</div>

## Extra Instructions

# Password Protection

1. Go to [p.js](https://github.com/GoStarLight/StarLight/blob/main/p.js)
2. Set "Challange" put it to true

It should look something like..

```
const pass = {
 challenge: true,
 users: {

   username: "password",
   anotheruser: "anotherpassword",
 },
};


const authenticate = (username, password) => {
 if (!pass.challenge) {
   return true;
 }
 return pass.users[username] && pass.users[username] === password;
};

export { pass, authenticate };
```

3. Add users using the format username: "password",

# Changing Port

1. Go to [index.js](https://github.com/GoStarLight/StarLight/blob/main/index.js) (not in public)
2. Locate the line: `const port = process.env.PORT || 8080;`
3. Change the 8080 to your desired port

> [!IMPORTANT]  
> If your desired port is under 1023 run the following command:

```
sudo PORT=1023
```

# Updating Deployments

Updating will give you many benefits like

- New Features
- Better Support
- Security Updates

## Console & Github Codespace

> [!IMPORTANT]  
> This Method May Overwrite Changes You Made

```
cd StarLight
git pull --force --allow-unrelated-histories
```

## Github Repo

> [!IMPORTANT]  
> This Method Will Overwrite Changes You Made

1. Go to your StarLight Forked Repo
2. Press "Sync Fork" near the top of the page
3. Press "Update Branch"

## Reporting Issues

If you are having any kind of issues or error make a [Github Issue](https://github.com/GoStarLight/StarLight/issues) or join [Discord Server](https://discord.gg/Y9tGpfCwUf)

## Contributors

Thank you to the Contributors who helped!

<a href="https://github.com/GoStarLight/StarLight/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=GoStarLight/StarLight" />
</a>
