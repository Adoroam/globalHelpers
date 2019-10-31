# node-red global helper functions

> repo local path on all machines: `/home/ado/nodered/globalHelpers`

## Usage
- add helpers to settings.js 
  - location: `/home/ado/nodered/red/settings.js`
  - section: `functionGlobalContext`
  - syntax: `fns:require($repoPath)`
- declare variable or destructure from `context.global.fns`

## Example 
```js
const { unique } = context.global.fns
const data = ['x', 'x', 'y', 'z']

msg.payload = data.reduce(unique, [])
// ['x', 'y', 'z']
return msg
```

You can choose any variable name when declaring it in the settings file, but we're currently using `fns` for consistency.

You must install `pdftk` (apt, not npm) for `pdffiller` to work correctly.