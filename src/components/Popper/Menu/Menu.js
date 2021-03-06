import PropTypes from 'prop-types';
import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';

import styles from './Menu.module.scss';
import { Wrapper as PopWrapper } from '@/components/Popper';
import Header from './Header';
import MenuItem from './MenuItem';
import { useState } from 'react';

const cx = classNames.bind(styles);
const defaultFn = () => {};
function Menu({ items, children, hideOnClickProp = false, onChange = defaultFn }) {
    const [history, setHistory] = useState([{ data: items }]);
    let currentHistory = history[history.length - 1];

    const renderItem = () => {
        return currentHistory.data.map((item, index) => {
            let isParent = !!item.children;
            return (
                <MenuItem
                    key={index}
                    data={item}
                    onClick={() => {
                        if (isParent) {
                            setHistory((prev) => [...prev, item.children]);
                        } else {
                            onChange(item);
                        }
                    }}
                ></MenuItem>
            );
        });
    };
    const handleBackToPreviousMenu = () => {
        setHistory((prev) => prev.slice(0, prev.length - 1));
    };
    const renderCurrentMenu = (attrs) => (
        <div className={cx('content')} tabIndex="-1" {...attrs}>
            <PopWrapper className={cx('popper-menu')}>
                {history.length > 1 && (
                    <Header title={currentHistory.title} onBack={handleBackToPreviousMenu} />
                )}
                <div className={cx('menu-list')}>{renderItem()}</div>
            </PopWrapper>
        </div>
    );
    const handleBackToMainMenu = () => {
        setHistory((prev) => prev.slice(0, 1));
    };

    return (
        <Tippy
            offset={[12, 8]}
            interactive
            placement="bottom-end"
            delay={[0, 700]}
            hideOnClick={hideOnClickProp}
            render={renderCurrentMenu}
            onHide={handleBackToMainMenu}
        >
            {children}
        </Tippy>
    );
}

Menu.propTypes = {
    items: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired,
};

export default Menu;
