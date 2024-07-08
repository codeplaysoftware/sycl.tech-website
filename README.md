# sycl.tech Website

[![Scorecard supply-chain security](https://github.com/codeplaysoftware/sycl.tech-website/actions/workflows/scorecard.yml/badge.svg)](https://github.com/codeplaysoftware/sycl.tech-website/actions/workflows/scorecard.yml)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/codeplaysoftware/sycl.tech-website/badge)](https://scorecard.dev/viewer/?uri=github.com/codeplaysoftware/sycl.tech-website)

## About The Project

This repository contains the source code for the <https://sycl.tech> website. Written mostly in TypeScript using
the [Angular framework](https://angular.dev/), this project provides a responsive, interactive website that can be 
accessed via GitHub pages.

**Please note:** that the sycl.tech content is available at
a [separate repository available here][sycl.tech-content-repo].

### Built With

![Angular][angular.io] ![Node.JS][node.js] ![SASS][sass]

### Features

* Built on top of Angular framework
* Static generation using Angular Universal
* Clean, user-friendly UI
* Fully responsive design
* Site-wide search
* Filtering of collections (news, videos, projects, research etc)
* Uses [JSON Feed .json files](https://www.jsonfeed.org/version/1/) as "backend" to facilitate serverless design
* Interactive SYCL playground
* Much more!

## Getting Started

Install Node and Angular CLI.

### Local Development Server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you
change any of the source files.

### Build the Site

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Notes

* This site attempts to statically generate as much as possible. The Angular pre-render functionality requires a
  `routes.txt` file which we generate using a small Python script. Generated routes are appended to the 
  current `routes.txt` file.

## Contributing

Everyone is welcome to contribute to this project. If you have a typo fix or a new feature, please create a PR!

Please see the `CONTRIBUTING.md` file for more details. 

## License

Distributed under the Apache 2.0 License. See `LICENSE.txt` file for more information.

We use Material and Roboto fonts within this repository. Licenses are available in the enclosing directories.

## Contact

<dev-rel@codeplay.com>

[sycl.tech-content-repo]: <https://sycl.tech> "SYCL.tech Content Repository"
[angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[node.js]: https://img.shields.io/badge/Nodejs-DD0031?style=for-the-badge&logo=angular&logoColor=white
[sass]: https://img.shields.io/badge/sass-DD0031?style=for-the-badge&logo=angular&logoColor=white