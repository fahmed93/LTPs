# LTPs - Long Term Plans

A React Native mobile app for couples to manage their shared life together. LTPs helps you organize everything from recipes and grocery lists to travel plans and home projects.

## Features

LTPs includes multiple independent features to help manage your relationship and shared activities:

- 📖 **Shared Recipe Lists** - Collect and organize your favorite recipes together
- 🛒 **Grocery List** - Collaborative shopping lists that sync in real-time
- ✈️ **Travel Plans & Memories** - Plan trips and preserve travel memories
- 🏠 **Home Projects** - Track and manage home improvement projects

## Tech Stack

- **React Native** - Cross-platform mobile development
- **React Native Web** - Web deployment via GitHub Pages
- **TypeScript** - Type-safe code
- **Spec-Kit** - Spec-driven development workflow

## Deployment

The app automatically deploys to GitHub Pages when changes are pushed to the `main` branch. The web version is available at: https://fahmed93.github.io/LTPs/

---

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

### Web

Run the app in a web browser for development or testing:

```sh
# Using npm
npm run web

# OR build for production
npm run build:web
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

# Spec-Kit Integration

This project uses [Spec-Kit](https://github.com/github/spec-kit) for spec-driven development. Spec-Kit commands are available in the `.github/agents/` directory:

- `/speckit.constitution` - Define project principles and development guidelines
- `/speckit.specify` - Create feature specifications
- `/speckit.plan` - Create technical implementation plans
- `/speckit.tasks` - Break down plans into actionable tasks
- `/speckit.implement` - Execute implementation
- `/speckit.analyze` - Analyze existing code
- `/speckit.clarify` - Get clarification on specifications
- `/speckit.checklist` - Track progress with checklists

## Project Structure

```
LTPs/
├── .github/
│   ├── agents/          # Spec-Kit command definitions
│   └── workflows/       # GitHub Actions workflows
├── android/             # Android native code
├── ios/                 # iOS native code
├── public/              # Web static files
├── spec/                # Specifications directory
├── memory/              # Project memory and context
├── App.tsx              # Main app component
├── index.js             # React Native entry point
├── index.web.js         # Web entry point
└── webpack.config.js    # Web build configuration
```
