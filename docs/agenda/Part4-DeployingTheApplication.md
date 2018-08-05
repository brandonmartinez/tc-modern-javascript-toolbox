# The Modern JavaScript Toolbox: 20 Years in the Making!

## Part 4: Deploying the Application

### Summary
We have a working app… or hopefully we do; we did spend only a couple hours building this thing. Regardless, let's deploy this to the WWW, or as you modern kids might call it, the cloud!

### Steps
1. Update production and development gulp steps to allow output to production `.dist` folder
2. Create web.config and deploy to .dist folder
    1. Create web.config: `touch config/web.config`
    2. Add copy task for production task set
3. Deploy to server or cloud