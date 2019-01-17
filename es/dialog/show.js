import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp2;

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ConfigProvider from '../config-provider';
import Message from '../message';
import zhCN from '../locale/zh-cn';
import dialog from './dialog';

var Dialog = ConfigProvider.config(dialog);

var noop = function noop() {};
var MESSAGE_TYPE = {
    alert: 'warning',
    confirm: 'help'
};

var Modal = (_temp2 = _class = function (_Component) {
    _inherits(Modal, _Component);

    function Modal() {
        var _temp, _this, _ret;

        _classCallCheck(this, Modal);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = {
            visible: true,
            loading: false
        }, _this.close = function () {
            _this.setState({
                visible: false
            });
        }, _this.loading = function (loading) {
            _this.setState({
                loading: loading
            });
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    Modal.prototype.wrapper = function wrapper(fn, callback) {
        var _this2 = this;

        return function () {
            var res = fn();
            if (res && res.then) {
                _this2.loading(true);

                res.then(function (result) {
                    _this2.loading(false);

                    if (result !== false) {
                        callback();
                    }
                }).catch(function () {
                    _this2.loading(false);
                });
            } else if (res !== false) {
                callback();
            }
        };
    };

    Modal.prototype.render = function render() {
        var _props = this.props,
            prefix = _props.prefix,
            type = _props.type,
            title = _props.title,
            content = _props.content,
            messageProps = _props.messageProps,
            footerActions = _props.footerActions,
            onOk = _props.onOk,
            onCancel = _props.onCancel,
            onClose = _props.onClose,
            okProps = _props.okProps,
            needWrapper = _props.needWrapper,
            rtl = _props.rtl,
            others = _objectWithoutProperties(_props, ['prefix', 'type', 'title', 'content', 'messageProps', 'footerActions', 'onOk', 'onCancel', 'onClose', 'okProps', 'needWrapper', 'rtl']);

        var newTitle = needWrapper && type ? null : title;

        var newContent = needWrapper && type ? React.createElement(
            Message,
            _extends({
                size: 'large',
                shape: 'addon',
                type: MESSAGE_TYPE[type]
            }, messageProps, {
                title: title,
                rtl: rtl,
                className: cx(prefix + 'dialog-message', messageProps.className) }),
            content
        ) : content;

        var newFooterActions = footerActions || (type === 'alert' ? ['ok'] : type === 'confirm' ? ['ok', 'cancel'] : undefined);
        var newOnOk = this.wrapper(onOk, this.close);
        var newOnCancel = this.wrapper(onCancel, this.close);
        var newOnClose = this.wrapper(onClose, this.close);

        var _state = this.state,
            visible = _state.visible,
            loading = _state.loading;

        okProps.loading = loading;

        return React.createElement(
            Dialog,
            _extends({
                role: 'alertdialog'
            }, others, {
                visible: visible,
                title: newTitle,
                rtl: rtl,
                footerActions: newFooterActions,
                onOk: this.state.loading ? noop : newOnOk,
                onCancel: newOnCancel,
                onClose: newOnClose,
                okProps: okProps }),
            newContent
        );
    };

    return Modal;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    pure: PropTypes.bool,
    rtl: PropTypes.bool,
    type: PropTypes.string,
    title: PropTypes.node,
    content: PropTypes.node,
    messageProps: PropTypes.object,
    footerActions: PropTypes.array,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    onClose: PropTypes.func,
    okProps: PropTypes.object,
    locale: PropTypes.object,
    needWrapper: PropTypes.bool
}, _class.defaultProps = {
    prefix: 'next-',
    pure: false,
    messageProps: {},
    onOk: noop,
    onCancel: noop,
    onClose: noop,
    okProps: {},
    locale: zhCN.Dialog,
    needWrapper: true
}, _temp2);
Modal.displayName = 'Modal';


var ConfigModal = ConfigProvider.config(Modal, { componentName: 'Dialog' });

/**
 * 创建对话框
 * @exportName show
 * @param {Object} config 配置项
 * @returns {Object} 包含有 hide 方法，可用来关闭对话框
 */
export var show = function show() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var container = document.createElement('div');
    var unmount = function unmount() {
        if (config.afterClose) {
            config.afterClose();
        }
        ReactDOM.unmountComponentAtNode(container);
        container.parentNode.removeChild(container);
    };

    document.body.appendChild(container);
    var newContext = ConfigProvider.getContext();

    var instance = void 0,
        myRef = void 0;

    ReactDOM.render(React.createElement(
        ConfigProvider,
        newContext,
        React.createElement(ConfigModal, _extends({}, config, { afterClose: unmount, ref: function ref(_ref) {
                myRef = _ref;
            } }))
    ), container, function () {
        instance = myRef;
    });
    return {
        hide: function hide() {
            var inc = instance && instance.getInstance();
            inc && inc.close();
        }
    };
};

var methodFactory = function methodFactory(type) {
    return function () {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        config.type = type;
        return show(config);
    };
};

/**
 * 创建警示对话框
 * @exportName alert
 * @param {Object} config 配置项
 * @returns {Object} 包含有 hide 方法，可用来关闭对话框
 */
export var alert = methodFactory('alert');

/**
 * 创建确认对话框
 * @exportName confirm
 * @param {Object} config 配置项
 * @returns {Object} 包含有 hide 方法，可用来关闭对话框
 */
export var confirm = methodFactory('confirm');