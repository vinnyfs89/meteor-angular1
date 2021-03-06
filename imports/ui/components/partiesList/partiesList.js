import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import { Counts } from 'meteor/tmeasday:publish-counts';

import template from './partiesList.html';
import {Parties} from '../../../api/parties/index';
import { name as PartiesSort } from '../partiesSort/partiesSort';
import { name as PartiesMap } from '../partiesMap/partiesMap';
import { name as PartyAdd} from '../partyAdd/partyAdd';
import { name as PartyRemove} from '../partyRemove/partyRemove';
import { name as PartyCreator } from '../partyCreator/partyCreator';
import { name as PartyRsvp } from '../partyRsvp/partyRsvp';
import { name as PartyRsvpsList } from '../partyRsvpsList/partyRsvpsList';

// Agora está em ES6 - EcmaScript 6 e sendo carregado dinamicamente via LazyLoad
class PartiesList {
    constructor($scope, $reactive) {
        'ngInject';

        $reactive(this).attach($scope);

        this.perPage = 3;
        this.page = 1;
        this.sort = {
            name: 1
        };
        this.searchText = '';

        this.subscribe('parties', () => [{
            limit: parseInt(this.perPage),
            skip: parseInt((this.getReactively('page') - 1) * this.perPage ),
            sort: this.getReactively('sort')
        }, this.getReactively('searchText')]);

        this.helpers({
            parties() {
                return Parties.find({}, {
                    sort : this.getReactively('sort')
                });
            },
            partiesCount() {
                return Counts.get('numberOfParties');
            },
            isLoggedIn() {
                return !!Meteor.userId();
            },
            currentUserId() {
                return Meteor.userId();
            }
        });
    }

    pageChanged(newPage) {
        this.page = newPage;
    }

    sortChanged(sort) {
        this.sort = sort;
    }

    isOwner(party) {
        return this.isLoggedIn && party.owner === this.currentUserId;
    }

}

const name = 'partiesList';

// create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
    utilsPagination,
    PartiesSort,
    PartiesMap,
    PartyAdd,
    PartyRemove,
    PartyCreator,
    PartyRsvp,
    PartyRsvpsList
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