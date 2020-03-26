'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const _ = require('lodash');
const path = require('path');
const mkdirp = require('mkdirp');
const prefix = 'packer-';

function computeProjectName(name) {
  name = _.kebabCase(name);
  name = name.indexOf(prefix) === 0 ? name : prefix + name;
  return name;
}

module.exports = class extends Generator {
  initializing() {
    this.props = {
      projectName: this.options.projectName || this.appname,
      imageName: this.options.imageName || ''
    };
  }

  _askForProjectName() {
    const done = this.async();
    return this.prompt({
      type: 'input',
      name: 'projectName',
      default: computeProjectName(path.basename(process.cwd())),
      message: `What is your project name? (The generated project name will be in form ${prefix}${chalk.green(
        'projectName'
      )}`,
      store: true
    }).then(answer => {
      this.props.projectName = computeProjectName(answer.projectName);
      done();
    });
  }

  _askForImageName() {
    const done = this.async();
    return this.prompt({
      type: 'input',
      name: 'imageName',
      default: '',
      message: 'What is the name of the Image to build?',
      store: true
    }).then(answer => {
      this.props.imageName = answer.imageName;
      done();
    });
  }

  get prompting() {
    return {
      askForProjectName: this._askForProjectName,
      askForImageName: this._askForImageName
    };
  }

  configuring() {}

  default() {
    if (path.basename(this.destinationPath()) !== this.props.projectName) {
      this.log(
        `Your generator must be inside a folder named ${
          this.props.projectName
        }\nI'll automatically create this folder.`
      );
      mkdirp(this.props.projectName);
      this.destinationRoot(this.destinationPath(this.props.projectName));
    }
  }

  writing() {
    // Copy Packer main template file
    this.fs.copyTpl(
      this.templatePath('template.json.ejs'),
      this.destinationPath('template.json'),
      {
        projectName: this.props.projectName,
        imageName: this.props.imageName
      }
    );

    // Copy Ansible Playbook file
    this.fs.copyTpl(
      this.templatePath('playbook.yml.ejs'),
      this.destinationPath('playbook.yml'),
      {
        projectName: this.props.projectName,
        imageName: this.props.imageName
      }
    );

    // Copy Ansible Galaxy requirements file
    this.fs.copy(
      this.templatePath('requirements.yml'),
      this.destinationPath('requirements.yml')
    );

    // Copy .gitignore file
    this.fs.copy(this.templatePath('.gitignore'), this.destinationPath('.gitignore'));

    this.fs.copyTpl(
      this.templatePath('README.md.ejs'),
      this.destinationPath('README.md'),
      {
        projectName: this.props.projectName
      }
    );

    this.fs.copyTpl(this.templatePath('Makefile.ejs'), this.destinationPath('Makefile'));
  }

  install() {}

  end() {
    this.log(`Thanks for using ${chalk.cyan('generator-packer')}.`);
  }
};
