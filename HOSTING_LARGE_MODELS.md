# Hosting Large 3D Models for GitHub Pages

Since GitHub has a file size limit of 100MB (and recommends keeping repositories under 1GB), large 3D models (GLTF/GLB/FBX) should not be committed directly to the repository if they are large.

Instead, we recommend hosting the model externally and configuring the application to load it via an environment variable.

## Recommended: GitHub Releases (Free & Fast)

The best way to host your model for a GitHub Pages site is to use **GitHub Releases**. This keeps your model associated with your repository without bloating the git history.

### Step 1: Create a Release
1. Go to your repository on GitHub.
2. Click on **Releases** (on the right sidebar) -> **Draft a new release**.
3. Tag the release (e.g., `v1.0.0-assets`).
4. Give it a title (e.g., "3D Model Assets").
5. Upload your `.glb`, `.gltf`, or `.fbx` file in the "Attach binaries by dropping them here or selecting them" section.
6. Click **Publish release**.

### Step 2: Get the Download Link
Once published, you have two options for the link:

#### Option A: jsDelivr CDN (Recommended)
This is usually faster and handles CORS headers correctly automatically.
Format:
```
https://cdn.jsdelivr.net/gh/YOUR_USERNAME/YOUR_REPO_NAME@RELEASE_TAG/FILENAME
```
Example:
If your user is `jules`, repo is `portfolio`, tag is `v1.0.0-assets`, and file is `robot.glb`:
`https://cdn.jsdelivr.net/gh/jules/portfolio@v1.0.0-assets/robot.glb`

#### Option B: Direct GitHub Link
Right-click the asset in the Release page and copy the link address.
It usually looks like:
`https://github.com/USERNAME/REPO/releases/download/TAG/FILENAME`

### Step 3: Configure GitHub Pages
1. Go to your repository **Settings**.
2. Go to **Secrets and variables** -> **Actions**.
3. Click on the **Variables** tab (NOT Secrets).
4. Click **New repository variable**.
5. Name: `VITE_MODEL_URL`
6. Value: Paste the URL from Step 2.
7. Click **Add variable**.

### Step 4: Trigger a Deployment
1. Go to the **Actions** tab.
2. Select the **Deploy to GitHub Pages** workflow on the left.
3. Click **Run workflow** -> **Run workflow**.

Your site will rebuild, and the new environment variable will be injected into the build.

## Alternative: Local Development

For local development, you can place the model in `public/models/` and reference it locally.
1. Create `public/models/` if it doesn't exist.
2. Place your file there (e.g., `my-model.glb`).
3. Create a `.env` file in the root directory:
   ```
   VITE_MODEL_URL=/models/my-model.glb
   ```
4. **Important:** The `.gitignore` is configured to ignore files in `public/models/` to prevent you from accidentally committing them. Do not force add them if they are large!

## Troubleshooting

- **CORS Errors:** If you see CORS errors in the console, ensure you are using the jsDelivr link (Option A) or that your hosting provider supports Cross-Origin Resource Sharing.
- **Model Not Loading:** Check the browser console (F12) for 404 errors. Verify the URL is correct by opening it in a new tab.
