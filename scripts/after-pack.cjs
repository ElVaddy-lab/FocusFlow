const { execFile } = require("node:child_process");
const fs = require("node:fs/promises");
const path = require("node:path");

function run(command, args) {
  return new Promise((resolve, reject) => {
    execFile(command, args, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`${error.message}\n${stdout || ""}${stderr || ""}`));
        return;
      }

      resolve();
    });
  });
}

exports.default = async function afterPack(context) {
  if (context.electronPlatformName !== "win32") {
    return;
  }

  const projectDir = context.packager.info.projectDir;
  const appInfo = context.packager.appInfo;
  const exePath = path.join(context.appOutDir, `${appInfo.productFilename}.exe`);
  const iconPath = path.join(projectDir, "build", "icon.ico");
  const rceditPath = path.join(projectDir, "node_modules", "electron-winstaller", "vendor", "rcedit.exe");
  const windowsVersion = appInfo.shortVersionWindows || appInfo.getVersionInWeirdWindowsForm();

  await Promise.all([fs.access(exePath), fs.access(iconPath), fs.access(rceditPath)]);

  await run(rceditPath, [
    exePath,
    "--set-icon",
    iconPath,
    "--set-version-string",
    "FileDescription",
    appInfo.productName,
    "--set-version-string",
    "ProductName",
    appInfo.productName,
    "--set-version-string",
    "InternalName",
    appInfo.productFilename,
    "--set-version-string",
    "OriginalFilename",
    `${appInfo.productFilename}.exe`,
    "--set-version-string",
    "LegalCopyright",
    appInfo.copyright,
    "--set-file-version",
    appInfo.shortVersion || appInfo.buildVersion,
    "--set-product-version",
    windowsVersion,
  ]);
};
