import { useState } from 'react';
import Stocks from '../Stocks/Stocks';
import Crypto from '../Crypto/Crypto';
import Forex from '../Forex/Forex';

const Tabs = () => {
    const tabs = [
        {
            name: 'Stocks',
            component: Stocks
        },
        {
            name: 'Crypto',
            component: Crypto
        },
        {
            name: 'Forex',
            component: Forex
        },
    ];
    const [activeTab, setActiveTab] = useState(tabs[0]);

    return (
        <section className='tabs'>
            <div className="flex border-b">
            {tabs.map((tab, index) => (
                <button
                key={index}
                className={`tab-buttons py-2 px-4 flex-1 ${activeTab.name === tab.name ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
                >
                {tab.name}
                </button>
            ))}
            </div>
            <div className="p-4">
            {tabs.map((tab, index) => (
                <div
                key={index}
                style={{ display: activeTab.name === tab.name ? 'block' : 'none' }}
                >
                <tab.component />
                </div>
            ))}
            </div>
        </section>
    );
};

export default Tabs;