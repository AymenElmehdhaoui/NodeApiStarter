import { cp } from "shelljs";

// Copy email template to dist folder
cp("-R", "src/templates/", "dist/templates/");
