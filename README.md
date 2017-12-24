Snabbdom Experiment
===

Just an experiment with getting [snabbdom](https://github.com/snabbdom/snabbdom) up and running for frontend web dev.

Tools
---

Why are there so many effin' js tools, and why does each have like 100s of dependencies??

* yarn: node package management
* browserify: create bundles
* typescript: better javascript?

Notes from scratch
---

### Files


| file | notes |
| --- | --- |
| `node_modules/` | (uncommitted) node dependencies installed by yarn (`yarn`, `yarn add`, `yarn remove`) |
| `bundle.js` | (uncommitted) generated through browserify (`./node_modules/.bin/browserify main.js > bundle.js`) |
| `package.json` | package information generated by yarn (`yarn init`) |
| `yarn.lock` | dependency lock generated by yarn |



### Commands

```
brew install yarn
yarn init
yarn add browserify
yarn add snabbdom
yarn add typescript
```
