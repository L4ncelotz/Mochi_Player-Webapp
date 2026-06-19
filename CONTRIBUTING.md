# Contributing to Mochi Player 🎵

First off, thank you for considering contributing to Mochi Player! It's people like you that make Mochi Player such a great tool for everyone.

## Where do I go from here?

If you've noticed a bug or have a feature request, make one! It's generally best if you get confirmation of your bug or approval for your feature request this way before starting to code.

## Fork & create a branch

If this is something you think you can fix, then fork Mochi Player and create a branch with a descriptive name.

A good branch name would be (where issue #325 is the ticket you're working on):

```sh
git checkout -b 325-add-new-visualizer
```

## Get the test suite running

Make sure you're using Node.js version 18 or higher.

1. Install dependencies:
   ```sh
   npm install
   ```

2. Start the development server:
   ```sh
   npm run dev
   ```

3. Open `http://localhost:5173/` in your browser.

## Implement your fix or feature

At this point, you're ready to make your changes! Feel free to ask for help; everyone is a beginner at first :smile_cat:

## Make a Pull Request

At this point, you should switch back to your master branch and make sure it's up to date with Mochi Player's master branch:

```sh
git remote add upstream git@github.com:L4ncelotz/Mochi_Player-Webapp.git
git checkout main
git pull upstream main
```

Then update your feature branch from your local copy of main, and push it!

```sh
git checkout 325-add-new-visualizer
git rebase main
git push --set-upstream origin 325-add-new-visualizer
```

Finally, go to GitHub and make a Pull Request :D
