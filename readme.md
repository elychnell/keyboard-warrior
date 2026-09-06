# Keyboard Warrior – Legacy

The original version of **Keyboard Warrior**, a browser-based typing game developed using PHP, MySQL, JavaScript and CSS.

This repository is preserved as a legacy version of the project and represents the original architecture and implementation before the project was later redesigned using a more modern technology stack.

## About the Project

Keyboard Warrior is a typing game where players improve their typing speed and accuracy through different typing challenges.

The original application grew beyond the basic typing functionality and included user accounts, social features and multiplayer game modes.

## Features

* Typing practice
* Swedish and English word lists
* Words per minute (WPM)
* Characters per minute (CPM)
* Score and error tracking
* Interactive on-screen keyboard
* User accounts and sessions
* Friend system
* Friend requests
* Messaging
* Multiplayer games
* Head-to-head matches
* Game invitations
* User statistics
* Premium users
* Admin functionality

## Technology

* PHP
* MySQL
* JavaScript
* jQuery
* HTML
* CSS

## Architecture

The original application uses a traditional server-side PHP architecture.

PHP handles page rendering, sessions, database communication and server-side logic, while JavaScript and jQuery handle much of the interactive typing experience in the browser.

Parts of the client-side functionality use JSON files generated from database data.

### Simplified architecture

```text
Browser
   │
   ├── HTML / CSS
   ├── JavaScript / jQuery
   │
   └── JSON data
          ▲
          │
        PHP
          │
          ▼
       MySQL
```

## Project Structure

```text
.
├── index.php
├── practicev2.php
├── multiplayer.php
├── head2head.php
├── admin.php
│
├── php/
│   ├── Database functionality
│   ├── User functionality
│   └── Supporting PHP logic
│
├── js/
│   └── Client-side game functionality
│
├── css/
│   └── Styling
│
├── img/
│   └── Images and graphics
│
└── keyboards/
    └── Keyboard-related assets
```

## Legacy Status

This repository represents the original implementation of Keyboard Warrior and is no longer the primary version of the application.

The code is intentionally preserved in its original form to document the earlier architecture and development approach.

Some parts of the application reflect older development practices, including tightly coupled PHP/HTML, procedural JavaScript, direct MySQL queries and custom handling of application state.

The purpose of keeping this repository is therefore **not to present it as modern production-ready code**, but to preserve the original implementation and provide a reference for the later rewrite.

## Modern Rewrite

A new version of Keyboard Warrior is planned as a separate project using a modern architecture and technology stack.

The rewrite will use the original application as a functional reference while addressing architectural and maintainability issues found in the legacy implementation.

The goal is to separate frontend, backend and data access responsibilities and provide a more maintainable foundation for features such as authentication, typing games and multiplayer functionality.

## Development Environment

The original application was developed and run locally using **XAMPP**, providing the Apache web server, PHP runtime and MySQL-compatible database environment required by the application.

The project was placed in the XAMPP web root and accessed through `localhost`.

The application expects a local database named:

```text
wordsdb
```

Database access is configured in `php/db.php`.

This repository represents the original local development environment and is **not configured for direct deployment to a production server**.

## Why Keep a Legacy Repository?

Keeping the original implementation makes it possible to compare the evolution of the project over time.

Rather than simply replacing the old code, the legacy version documents where the project started and provides the foundation for understanding the architectural decisions made in the modern rewrite.
