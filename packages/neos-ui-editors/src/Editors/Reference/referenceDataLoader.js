import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

export default ({isMulti}) => WrappedComponent => {
    @neos(globalRegistry => ({
        nodeLookupDataLoader: globalRegistry.get('dataLoaders').get('NodeLookup'),
        nodeTypeRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
    }))
    @connect(state => ({
        contextForNodeLinking: selectors.UI.NodeLinking.contextForNodeLinking(state)
    }))

    class ReferenceDataLoader extends PureComponent {
        static propTypes = {
            value: PropTypes.any,
            options: PropTypes.shape({
                nodeTypes: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
                placeholder: PropTypes.string,
                threshold: PropTypes.number,
                startingPoint: PropTypes.string
            }),

            nodeLookupDataLoader: PropTypes.shape({
                resolveValue: PropTypes.func.isRequired,
                resolveValues: PropTypes.func.isRequired,
                search: PropTypes.func.isRequired
            }).isRequired,
            nodeTypeRegistry: PropTypes.shape({
                getNodeType: PropTypes.func.isRequired
            }),

            contextForNodeLinking: PropTypes.object.isRequired
        };

        state = {
            isLoading: false,
            options: [],
            searchOptions: [],
            results: []
        };

        componentDidMount() {
            this.resolveValue();
        }

        componentDidUpdate(prevProps) {
            if (prevProps.value !== this.props.value) {
                this.resolveValue();
            }
        }

        resolveValue = () => {
            const valueProvided = isMulti ? Array.isArray(this.props.value) : this.props.value;
            if (valueProvided) {
                this.setState({isLoading: true});
                const resolver = isMulti ? this.props.nodeLookupDataLoader.resolveValues.bind(this.props.nodeLookupDataLoader) : this.props.nodeLookupDataLoader.resolveValue.bind(this.props.nodeLookupDataLoader);
                resolver(this.getDataLoaderOptions(), this.props.value)
                    .then(options => {
                        options.forEach(option => {
                            const nodeType = this.props.nodeTypeRegistry.getNodeType(option.nodeType);
                            const icon = nodeType?.ui?.icon;
                            if (icon) {
                                option.icon = icon;
                            }
                        });

                        this.setState({
                            isLoading: false,
                            options
                        });
                    });
            }
        }

        handleSearchTermChange = searchTerm => {
            if (searchTerm) {
                this.setState({isLoading: true, searchOptions: []});
                this.props.nodeLookupDataLoader.search(this.getDataLoaderOptions(), searchTerm)
                    .then(searchOptions => {
                        searchOptions.forEach(option => {
                            const nodeType = this.props.nodeTypeRegistry.getNodeType(option.nodeType);
                            const icon = nodeType?.ui?.icon;
                            if (icon) {
                                option.icon = icon;
                            }
                        });

                        this.setState({
                            isLoading: false,
                            searchOptions
                        });
                    });
            } else {
                this.setState({
                    isLoading: false,
                    searchOptions: []
                });
            }
        }

        getDataLoaderOptions() {
            const startingPoint = this.props?.options?.startingPoint;
            const contextForNodeLinking = startingPoint ?
                Object.assign({}, this.props.contextForNodeLinking, {
                    contextNode: startingPoint.indexOf('ClientEval:') === 0 ?
                        // eslint-disable-next-line no-new-func
                        new Function('return ' + startingPoint.replace('ClientEval:', ''))() :
                        startingPoint
                }) :
                this.props.contextForNodeLinking;

            return {
                nodeTypes: this.props?.options?.nodeTypes || ['Neos.Neos:Document'],
                contextForNodeLinking
            };
        }

        render() {
            const props = Object.assign({}, this.props, this.state);
            const options = isMulti ? this.state.options : (this.props.value ? this.state.options : this.state.searchOptions);
            return (
                <WrappedComponent
                    {...props}
                    options={options}
                    searchOptions={this.state.searchOptions}
                    displayLoadingIndicator={this.state.isLoading}
                    onSearchTermChange={this.handleSearchTermChange}
                    placeholder={this.props.options.placeholder}
                    threshold={this.props.options.threshold}
                    />
            );
        }
    }
    return ReferenceDataLoader;
};
