# express-directory-router

The express-directory-router allows you to safely load routes from a specified directory in your project and have it automatically get loaded into your express app.

## Installation

Install the package using one of the following commands:

```bash
# npm
npm install @ethan-davies/express-directory-router

# yarn
yarn add @ethan-davies/express-directory-router

# pnpm
pnpm add @ethan-davies/express-directory-router
```

## Usage

In your express app, import the package and use it like so:

```typescript
import DirectoryRouter from '@ethan-davies/express-directory-router';
import express from 'express';

import { join } from 'path';

const app = express();
const PORT = 3000


const router = new DirectoryRouter({
    directory: join(__dirname, 'routes'), // Directory to load routes from
    debug: true, // Optional, defaults to false
})

app.use(router.loadRouter());

app.listen(port, () => {
    console.log(`Listening on port *:${PORT}`);
})

```

When creating a new `DirectoryRouter`, you can pass in the following options:

- `directory` - The directory to load routes from, usually best to join it with `__dirname` to make it relative to the current file.

- `debug` - An optional boolean to enable logging of the routes that are being loaded, or warn you if routes are incorrectly exported. Note that this is an optional parameter and defaults to `false`.

## Directory structure

Once you have set up the `DirectoryRouter`, you can create your routes.

Routes are determined by the relative path of the file to the directory you specified when creating the `DirectoryRouter`.

There are two ways to register routes:

1. Using folders and a file named `routes.ts` or `routes.js` in the folder. For example:

```
{YOUR_ROUTE_DIRECTORY}/
└── dir1/
    └── dir2/
        └── route.ts
```

Would be registered as `/dir1/dir2` in the express app.

2. Using folders and a custom file name. For example:

```
{YOUR_ROUTE_DIRECTORY}/
└── dir1/
    └── dir2/
        └── test.ts
```

Would be registered as `/dir1/dir2/test` in the express app.

## Route files

Assuming you have correctly set up the directory structure, you can now create your route files. These are the files inside of the files you created in the previous section (for the examples we used `route.ts` and `test.ts`).

The route files should look like this:

```typescript
import { Router } from 'express';

const router = Router();

export default router;
```

But you can also add endpoints to the router like so:

```typescript
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.send('Hello, World!');
})

export default router;
```

Routes defined in these files will be automatically prefixed with the path of the file in the directory structure and will be loaded into the express app.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/ethan-davies/express-directory-router/blob/master/LICENSE) file for details.