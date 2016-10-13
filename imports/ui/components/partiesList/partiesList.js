import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './partiesList.html';
import {Parties} from '../../../api/parties';
import {name as PartyAdd} from '../partyAdd/partyAdd';
import {name as PartyRemove} from '../partyRemove/partyRemove';

// Agora está em ES6 - EcmaScript 6 e sendo carregado dinamicamente via LazyLoad
class PartiesList {
    constructor($scope, $reactive) {
        'ngInject';

        $reactive(this).attach($scope);

        this.helpers({
            parties() {
                return Parties.find({});
            }
        });
    }
}

const name = 'partiesList';

// create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
    PartyAdd,
    PartyRemove
]).component(name, {
    template,
    controllerAs: name,
    controller: PartiesList
}).config(config);

function config($stateProvider) {
    'ngInject';
    $stateProvider
        .state('parties', {
            url: '/parties',
            template: '<parties-list></parties-list>'
        });
    ;
}