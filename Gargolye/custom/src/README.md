## **Install Node.js and NPM**

To see if you have either of these already installed run the following commands independently in your terminal.

```bash
  node --version
  npm --version
```

If you have these already installed you should see a version number print to the terminal window.

```bash
v8.12.0
```

If you do not have either installed head over to [nodejs.org](https://nodejs.org/dist/latest-v8.x/) and download the node-v8.17.0-(x64 or x86 depending on if you have a 64 bit OS installed).msi. Once downloaded walk through the installer to get Node installed on your computer. **NPM will be installed with Node.js**

## **Install Gulp Globally**

To install the gulp-cli globally on your machine run the following command in your terminal.

```bash
  npm install gulp-cli -g
```

## **Opening the project & Running the local development server**

To get the local server up and running navigate to Anywhere/2.1/ and click on Solution3.sln to open the project in Visual Studio.

In the top menu click on DEBUG, from there select START WITHOUT DEBUGGING, this will start up anywhere in whatever browser you have setup in Visual Studio.

**ATTENTION**
If you have pulled in any code changes from the C# layer you will need to do another build. To do a build in the top menu click on BUILD, then select REBUILD SOLUTION. This will recompile the C#.

## **Starting up gulp**

What is Gulp for?

1. Transpiles your SCSS into CSS.
2. Transpiles your ES6 JavaScript to ES5.
3. Bundles your JS into a single file.
4. Minifies files.
5. Moves files to a distribution folder for builds.

To get Gulp up and running simply open a new command prompt and cd/ into Anywhere/2.1/Gargolye/custom, from there run the following command to install all of the dependencies:

```bash
npm i
```

**NOTE** You only have to run 'npm i' once, on initial setup.

Once you have all of the dependencies installed, open two terminal windows (cd to the custom folder in both), then run:

```bash
npm start (window 1)
npm run css (window 2)
```

From here on out you will open the project & start your local development server. Then proceed to opeing your two terminal windows to run both npm commands.

# MOVE TO NEW README CALLED HOWTO?

ANYW_GetDefaultAnywhereSettings for system settings
