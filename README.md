<!-- Banner Image -->

<h1 align="center">
  <img src="images/topic-icon-text.svg" alt="Topic Logo" />
</h1>
<h2 align="center">
  La malette à outils de l'engagement citoyen.
</h2>

<div align="center">

![Rocket Chat](rc-badge)

[![GitHub release][img-version-badge]][repo] [![Gitter][img-gitter-badge]][gitter] [![Build Status][img-travis-ci]][travis-ci] [![Code of Conduct][coc-badge]][coc] [![PRs Welcome][prs-badge]][prs] <a href="#patched-fonts" title=""><img src="https://raw.githubusercontent.com/wiki/ryanoasis/nerd-fonts/images/faux-shield-badge-os-logos.svg?sanitize=true" alt="Nerd Fonts - OS Support"></a> [![Twitter][twitter-badge]][twitter-intent]

---

- [📚 Documentation](#-documentation)
- [🗺 Project Layout](#-project-layout)
- [🏅 Badges](#-badges)
- [👏 Contributing](#-contributing)
- [❓ FAQ](#-faq)
- [💙 The Team](#-the-team)
- [License](#license)

Expo is an open-source platform for making universal native apps that run on Android, iOS, and the web. It includes a universal runtime and libraries that let you build native apps by writing React and JavaScript. This repository is where the Expo client software is developed, and includes the client apps, modules, apps, and more. The [Expo CLI](https://github.com/expo/expo-cli) repository contains the Expo development tools.

[Click here to view the Expo Community Guidelines](https://expo.io/guidelines). Thank you for helping keep the Expo community open and welcoming!

## 📚 Documentation

<p>Learn about building and deploying universal apps <a aria-label="expo documentation" href="https://docs.expo.io">in our official docs!</a></p>

- [Getting Started](https://docs.expo.io/)
- [API Reference](https://docs.expo.io/versions/latest/sdk/overview/)
- [Using Custom Native Modules](https://docs.expo.io/versions/latest/bare/exploring-bare-workflow/)

## 🗺 Project Layout

- [`packages`](/packages) All the source code for the Unimodules, if you want to edit a library or just see how it works this is where you'll find it.
- [`apps`](/apps) This is where you can find Expo projects which are linked to the development Unimodules. You'll do most of your testing in here.
- [`docs`](/docs) The source code for **https://docs.expo.io**
- [`templates`](/templates) The template projects you get when you run `expo start`
- [`react-native-lab`](/react-native-lab) This is our fork of `react-native`. We keep this very close to the upstream but sometimes need to add quick fixes locally before they can land.
- [`guides`](/guides) In-depth tutorials for advanced topics like contributing to the client.
- [`android`](/android) contains the Android project.
- [`home`](/home) contains the JavaScript source code of the app.
- [`ios`](/ios) contains the iOS project.
- [`ios/Exponent.xcworkspace`](/ios) is the Xcode workspace. Always open this instead of `Exponent.xcodeproj` because the workspace also loads the CocoaPods dependencies.
- [`tools`](/tools) contains build and configuration tools.
- [`template-files`](/template-files) contains templates for files that require private keys. They are populated using the keys in `template-files/keys.json`.
- [`template-files/ios/dependencies.json`](/template-files/ios/dependencies.json) specifies the CocoaPods dependencies of the app.

## 🏅 Badges

Let everyone know your app is universal with _Expo_!
<br/>

[![runs with expo](https://img.shields.io/badge/Runs%20with%20Expo-000.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.io/)

[![runs with expo](https://img.shields.io/badge/Runs%20with%20Expo-4630EB.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.io/)

```md
[![runs with expo](https://img.shields.io/badge/Runs%20with%20Expo-000.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.io/)

[![runs with expo](https://img.shields.io/badge/Runs%20with%20Expo-4630EB.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.io/)
```

## 👏 Contributing

If you like Expo and want to help make it better then check out our [contributing guide](/CONTRIBUTING.md)! Check out the [Expo CLI repo](http://github.com/expo/expo-cli) to work on the Expo CLI, and various other universal development tools.

## ❓ FAQ

If you have questions about Expo and want answers, then check out our [Frequently Asked Questions](https://docs.expo.io/versions/latest/introduction/faq/)!

If you still have questions you can ask them on our [forums](https://forums.expo.io) or on Twitter [@Expo](https://twitter.com/expo).

## 💙 The Team

Curious about who makes Expo? Here are our [team members](https://expo.io/about)!

## License

The Expo source code is made available under the [MIT license](LICENSE). Some of the dependencies are licensed differently, with the BSD license, for example.

# Topic App Mobile

La mallette à outil de l'engagement

Code source pour le projet d'application mobile écrit en React-Native et TypeScript.

---

# Copyright notice

Topic Mobile
Copyright (C) 2020 Topic App (W061014585)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

<!-- Links -->

[rocket-chat]: https://chat.topicapp.fr
[rc-badge]: https://img.shields.io/gitter/room/nwjs/nw.js.svg?style=for-the-badge
