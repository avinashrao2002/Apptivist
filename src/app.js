/* global algoliasearch instantsearch */

var tester = '{{newData.pfp}}' || '{{data.pfp}}'
const searchClient = algoliasearch(
  '9ZEA531BWY',
  'c9267065d4155f6887511396ad1d7669'
);

const search = instantsearch({
  indexName: 'users',
  searchClient,
});


search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: `
<article>
<div style = "display: inline;">
<img src = "algoliapic.jpg" style = "float: left; margin-left: 30px; width: 25px; height: 25px;" width ="100" height ="100">
  <h1 style = "margin-left: 30px;"> {{#helpers.highlight}}{ "attribute": "newData.userName" }{{/helpers.highlight}}</h1>
  <h1 style = "margin-left: 30px; "> {{#helpers.highlight}}{ "attribute": "data.userName" }{{/helpers.highlight}}</h1>
  </div>
  <button onclick = "encompass('{{objectID}}')" class="myRealButtons" style = "margin-top: 10px; background-color: #143240; color: #fff; margin-bottom: 20px; cursor: pointer;"> View Profile </button>
  <p style = "margin-left: 30px;">Name: {{#helpers.highlight}}{ "attribute": "newData.firstName" }{{/helpers.highlight}}
  {{#helpers.highlight}}{ "attribute": "newData.lastName" }{{/helpers.highlight}}</p>
  <p style = "margin-left: 30px;">{{#helpers.highlight}}{ "attribute": "data.firstName" }{{/helpers.highlight}}
  {{#helpers.highlight}}{ "attribute": "data.lastName" }{{/helpers.highlight}}</p>
  <img style = "margin-left: 30px; margin-top: 20px;" src ={{newData.pfp}} width ="100px" height ="auto" class = "profile-pic">
</article>
`,
    },
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
]);

search.start();

