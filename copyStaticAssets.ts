import * as shell from "shelljs";

shell.cp("-R", "src/public/js/", "dist/public/");
shell.cp("-R", "src/public/vendor", "dist/public/");
shell.cp("-R", "src/public/img", "dist/public/");
shell.cp("-R", "src/public/css/", "dist/public/");
