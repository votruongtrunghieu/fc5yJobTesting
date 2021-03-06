import React, { useRef } from 'react';
import {Switch, Route, BrowserRouter, Link} from 'react-router-dom';
import './style.scss'

interface propsInterf {
    id?: number
}

interface stateInterf {
    tdList: Array<string>;
    tdDone: Array<boolean>;
}

class Item extends React.Component<propsInterf, {}> {
    componentDidMount() {
    }
    removeTdItem(id:number) {
        var tmpTdList = [], tmpTdDone = [];
        for (var i = 0; i < thisOfAppConstructor.state.tdList.length; i++) {
            if (i != id) {
                tmpTdList.push(thisOfAppConstructor.state.tdList[i]);
                tmpTdDone.push(thisOfAppConstructor.state.tdDone[i]);
            }
        }
        thisOfAppConstructor.setState({tdList: tmpTdList});
        thisOfAppConstructor.setState({tdDone: tmpTdDone});
        localStorage.setItem('tdList', JSON.stringify(tmpTdList));
        localStorage.setItem('tdDone', JSON.stringify(tmpTdDone));
    }
    clickCBox(id:number) {
        var dt;
        if ((document.getElementById('cb' + id) as HTMLInputElement).checked == true) {
            dt = JSON.parse(localStorage.getItem('tdDone'));
            dt[id] = true;
        } else {
            dt = JSON.parse(localStorage.getItem('tdDone'));
            dt[id] = false;
        }
        localStorage.setItem('tdDone', JSON.stringify(dt));
        thisOfAppConstructor.setState({tdDone: dt});
    }
    render() {
        var that = this;
        setTimeout(function () {
            if (thisOfAppConstructor.state.tdDone[that.props.id] == true) (document.getElementById('cb' + that.props.id) as HTMLInputElement).checked = true;
            else (document.getElementById('cb' + that.props.id) as HTMLInputElement).checked = false;
        }, 100);
        return (
            <li className="items">
                <input type="checkbox" id={'cb' + this.props.id} onClick={() => {this.clickCBox(this.props.id)}}/>
                <div style={thisOfAppConstructor.state.tdDone[this.props.id] ? {textDecoration: 'line-through', color: 'gray'} : {}}>{this.props.children}</div>
                <span onClick={() => {this.removeTdItem(this.props.id)}}>remove</span>
            </li>
        );
    }
}

var thisOfAppConstructor;

class App extends React.Component<propsInterf, stateInterf> {
    private stat: number = 0;
    private data;
    preventSub(e) { 
        e.preventDefault();
        var dt = JSON.parse(localStorage.getItem('tdList'));
        dt.push((document.getElementById('inp') as HTMLInputElement).value);
        localStorage.setItem('tdList', JSON.stringify(dt));
        // This 's wrong. Why??? JSON.stringify(JSON.parse(localStorage.getItem('tdList')).push((document.getElementById('inp') as HTMLInputElement).value));
        dt = JSON.parse(localStorage.getItem('tdDone'));
        dt.push(false);
        localStorage.setItem('tdDone', JSON.stringify(dt));

        thisOfAppConstructor.state.tdList = thisOfAppConstructor.state.tdList.concat((document.getElementById('inp') as HTMLInputElement).value);
        thisOfAppConstructor.setState({tdDone: thisOfAppConstructor.state.tdDone.concat(false)});

        (document.getElementById('inp') as HTMLInputElement).value = '';
        return false;
    }
    clearCompleted() {
        var tmpTdList = [], tmpTdDone = [];
        for (var i = 0; i < thisOfAppConstructor.state.tdList.length; i++) {
            if (!thisOfAppConstructor.state.tdDone[i]) {
                tmpTdList.push(thisOfAppConstructor.state.tdList[i]);
                tmpTdDone.push(thisOfAppConstructor.state.tdDone[i]);
            }
        }
        thisOfAppConstructor.setState({tdList: tmpTdList});
        thisOfAppConstructor.setState({tdDone: tmpTdDone});
        localStorage.setItem('tdList', JSON.stringify(tmpTdList));
        localStorage.setItem('tdDone', JSON.stringify(tmpTdDone));
    }
    active() {
        thisOfAppConstructor.stat = 2;
        thisOfAppConstructor.setState({tdList: thisOfAppConstructor.state.tdList});
    }
    completed() {
        thisOfAppConstructor.stat = 1;
        thisOfAppConstructor.setState({tdList: thisOfAppConstructor.state.tdList});
    }
    selectAll() {
        var slAll = false;
        for (var i = 0; i < thisOfAppConstructor.state.tdDone.length; i++) {
            if (!thisOfAppConstructor.state.tdDone[i]) {
                slAll = true;
                break;
            }
        }
        var tmpDone = [];
        if (slAll) {
            for (var i = 0; i < thisOfAppConstructor.state.tdDone.length; i++) {
                tmpDone.push(true);
                (document.getElementById('cb' + i) as HTMLInputElement).checked = true;
            }
        } else {
            for (var i = 0; i < thisOfAppConstructor.state.tdDone.length; i++) {
                tmpDone.push(false);
                (document.getElementById('cb' + i) as HTMLInputElement).checked = false;
            }
        }
        localStorage.setItem('tdDone', JSON.stringify(tmpDone));
        thisOfAppConstructor.setState({tdDone: tmpDone});
    }
    TodoList() {
        if ((document.getElementById('home') as HTMLInputElement) != null) (document.getElementById('home') as HTMLInputElement).remove();
        var itemsLeft = 0;
        for (var i = 0; i < thisOfAppConstructor.state.tdDone.length; i++) {
            if (thisOfAppConstructor.state.tdDone[i] == false) itemsLeft++;
        }
        return (
            <div>
                <div style={{color: 'purple', textAlign: 'center'}}><h1>todos</h1></div>
                <div id="tdList">   
                    <div id="txtBox">
                        <label onClick={() => {thisOfAppConstructor.selectAll()}}>&#8711;</label>
                        <form action="" onSubmit={thisOfAppConstructor.preventSub} >
                            <input id="inp" placeholder="What needs to be done?"/>
                        </form>
                    </div>
                    <section>
                        <ul>
                            {thisOfAppConstructor.state.tdList.map(function (job:string, index) {
                                if (thisOfAppConstructor.stat == 0 || (thisOfAppConstructor.stat == 1 && thisOfAppConstructor.state.tdDone[index] == true) || (thisOfAppConstructor.stat == 2 && thisOfAppConstructor.state.tdDone[index] == false)) {
                                    return <Item id={index} key={index}>{job}</Item>
                                }
                            })}
                        </ul>
                    </section>
                    <div>
                        <span>{itemsLeft} item(s) left</span>
                        <button style={thisOfAppConstructor.stat == 0 ? {backgroundColor: 'green', marginLeft: '30px'} : {marginLeft: '30px'}} onClick={() => {thisOfAppConstructor.stat = 0; thisOfAppConstructor.setState({tdList: thisOfAppConstructor.state.tdList})}}>All</button>
                        <button style={thisOfAppConstructor.stat == 2 ? {backgroundColor: 'green', marginLeft: '10px'} : {marginLeft: '10px'}} onClick={() => {thisOfAppConstructor.active()}}>Active</button>
                        <button style={thisOfAppConstructor.stat == 1 ? {backgroundColor: 'green', marginLeft: '10px'} : {marginLeft: '10px'}} onClick={() => {thisOfAppConstructor.completed()}}>Completed</button>
                        <button style={itemsLeft == thisOfAppConstructor.state.tdDone.length ? {marginLeft: '20px', display: 'none'} : {marginLeft: '20px'}} onClick={() => {thisOfAppConstructor.clearCompleted()}}>Clear completed</button>
                    </div>
                </div>
            </div>
        );
    }
    async getData() {
        await fetch('https://jsonplaceholder.typicode.com/users').then(res => res.json()).then(dt => {thisOfAppConstructor.data = dt});
        localStorage.setItem('data', thisOfAppConstructor.data);
    }
    Users({match}) {
        if ((document.getElementById('home') as HTMLInputElement) != null) (document.getElementById('home') as HTMLInputElement).remove();
        //{match.params.id}
        (document.getElementById('bd') as HTMLElement).style.background = '-webkit-gradient(linear, left top, left bottom, from(#2D9CDB), to(#1B4088)) fixed';
        
        return (
            <div id="container">
                <div id="content">
                    <div id="name">
                        {thisOfAppConstructor.data[match.params.id].name}
                    </div>
                    <div id="user">
                    {thisOfAppConstructor.data[match.params.id].username}
                    </div>
                    <div id="companyName">
                        {thisOfAppConstructor.data[match.params.id].company.name}
                    </div>
                    <div id="email" className="lst">
                        <div id="emailIcon" className="lstIcon">
                            <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21.75 0H2.25C1.00734 0 0 1.00734 0 2.25V15.75C0 16.9927 1.00734 18 2.25 18H21.75C22.9927 18 24 16.9927 24 15.75V2.25C24 1.00734 22.9927 0 21.75 0ZM21.75 2.25V4.16273C20.699 5.01862 19.0234 6.3495 15.4412 9.15445C14.6518 9.77541 13.0881 11.2672 12 11.2498C10.9121 11.2674 9.34786 9.77517 8.55877 9.15445C4.97719 6.34992 3.30117 5.01877 2.25 4.16273V2.25H21.75ZM2.25 15.75V7.04991C3.32409 7.90542 4.8473 9.10594 7.16897 10.9239C8.19352 11.7304 9.98775 13.5108 12 13.5C14.0024 13.5108 15.7739 11.7563 16.8306 10.9243C19.1522 9.10636 20.6759 7.90552 21.75 7.04995V15.75H2.25Z" fill="#4F4F4F"/>
                            </svg>
                        </div>
                        <div id="emailDetail" className="lstDetail">
                            {thisOfAppConstructor.data[match.params.id].email}
                        </div>
                    </div>
                    <div id="address" className="lst">
                        <div id="addressIcon" className="lstIcon">
                            <svg width="24" height="19" viewBox="0 0 24 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 0.328949H2C0.895833 0.328949 0 1.22184 0 2.32237V16.9408C0 18.0413 0.895833 18.9342 2 18.9342H22C23.1042 18.9342 24 18.0413 24 16.9408V2.32237C24 1.22184 23.1042 0.328949 22 0.328949ZM7.33333 4.31579C8.80417 4.31579 10 5.50769 10 6.97369C10 8.43968 8.80417 9.63158 7.33333 9.63158C5.8625 9.63158 4.66667 8.43968 4.66667 6.97369C4.66667 5.50769 5.8625 4.31579 7.33333 4.31579ZM12 14.15C12 14.5902 11.5833 14.9474 11.0667 14.9474H3.6C3.08333 14.9474 2.66667 14.5902 2.66667 14.15V13.3526C2.66667 12.032 3.92083 10.9605 5.46667 10.9605H5.675C6.1875 11.1723 6.74583 11.2928 7.33333 11.2928C7.92083 11.2928 8.48333 11.1723 8.99167 10.9605H9.2C10.7458 10.9605 12 12.032 12 13.3526V14.15ZM21.3333 11.9572C21.3333 12.14 21.1833 12.2895 21 12.2895H15C14.8167 12.2895 14.6667 12.14 14.6667 11.9572V11.2928C14.6667 11.11 14.8167 10.9605 15 10.9605H21C21.1833 10.9605 21.3333 11.11 21.3333 11.2928V11.9572ZM21.3333 9.29934C21.3333 9.48207 21.1833 9.63158 21 9.63158H15C14.8167 9.63158 14.6667 9.48207 14.6667 9.29934V8.63487C14.6667 8.45214 14.8167 8.30263 15 8.30263H21C21.1833 8.30263 21.3333 8.45214 21.3333 8.63487V9.29934ZM21.3333 6.64145C21.3333 6.82418 21.1833 6.97369 21 6.97369H15C14.8167 6.97369 14.6667 6.82418 14.6667 6.64145V5.97698C14.6667 5.79425 14.8167 5.64474 15 5.64474H21C21.1833 5.64474 21.3333 5.79425 21.3333 5.97698V6.64145Z" fill="#4F4F4F"/>
                            </svg>
                        </div>
                        <div id="addressDetail" className="lstDetail">
                            {thisOfAppConstructor.data[match.params.id].address.street}, {thisOfAppConstructor.data[match.params.id].address.suite}, {thisOfAppConstructor.data[match.params.id].address.city}, {thisOfAppConstructor.data[match.params.id].address.zipcode}
                        </div>
                    </div>
                    <div id="phone" className="lst">
                        <div id="phoneIcon" className="lstIcon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M23.3152 16.9606L18.0652 14.7106C17.8409 14.615 17.5916 14.5949 17.3549 14.6532C17.1182 14.7116 16.9068 14.8452 16.7527 15.0341L14.4277 17.8747C10.7788 16.1543 7.84228 13.2178 6.12188 9.5689L8.9625 7.2439C9.15172 7.09 9.28565 6.87864 9.34401 6.64182C9.40237 6.40499 9.38199 6.1556 9.28594 5.9314L7.03594 0.681402C6.93052 0.439719 6.74408 0.242392 6.50876 0.123448C6.27344 0.0045045 6.00399 -0.0286013 5.74687 0.0298396L0.871875 1.15484C0.623986 1.21208 0.402818 1.35166 0.24447 1.55078C0.0861212 1.74991 -5.71036e-05 1.99683 2.83885e-08 2.25125C2.83885e-08 14.2747 9.74531 24.0012 21.75 24.0012C22.0045 24.0014 22.2515 23.9153 22.4507 23.7569C22.65 23.5986 22.7896 23.3773 22.8469 23.1294L23.9719 18.2544C24.0299 17.996 23.9961 17.7255 23.8763 17.4893C23.7564 17.2532 23.558 17.0662 23.3152 16.9606Z" fill="#4F4F4F"/>
                            </svg>
                        </div>
                        <div id="phoneDetail" className="lstDetail">
                            {thisOfAppConstructor.data[match.params.id].phone}
                        </div>
                    </div>
                    <div id="website" className="lst">
                        <div id="websiteIcon" className="lstIcon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.3095 8.68973C18.1101 11.4933 18.0717 15.9881 15.3263 18.7486C15.3212 18.7543 15.3151 18.7603 15.3095 18.766L12.1595 21.916C9.38117 24.6943 4.86107 24.6939 2.08321 21.916C-0.695074 19.1382 -0.695074 14.6175 2.08321 11.8397L3.82255 10.1004C4.2838 9.63913 5.07814 9.9457 5.10196 10.5975C5.13233 11.4283 5.2813 12.2629 5.55618 13.0688C5.64927 13.3417 5.58275 13.6436 5.37885 13.8475L4.76539 14.461C3.45168 15.7747 3.41047 17.9138 4.71125 19.2403C6.02488 20.58 8.18403 20.588 9.50774 19.2643L12.6577 16.1147C13.9792 14.7933 13.9737 12.6574 12.6577 11.3414C12.4843 11.1683 12.3095 11.0338 12.173 10.9398C12.0764 10.8735 11.9967 10.7855 11.9402 10.6829C11.8836 10.5803 11.8518 10.4659 11.8474 10.3489C11.8288 9.85354 12.0043 9.34312 12.3957 8.95171L13.3826 7.96476C13.6414 7.70596 14.0474 7.67418 14.3475 7.88362C14.6912 8.12359 15.0131 8.39334 15.3095 8.68973ZM21.9158 2.08307C19.1379 -0.694832 14.6178 -0.695207 11.8395 2.08307L8.68953 5.23307C8.68391 5.2387 8.67782 5.24479 8.67266 5.25042C5.92738 8.01098 5.88889 12.5058 8.68953 15.3093C8.98592 15.6057 9.3078 15.8754 9.65146 16.1154C9.95155 16.3248 10.3576 16.293 10.6163 16.0342L11.6032 15.0473C11.9946 14.6559 12.1701 14.1455 12.1516 13.6501C12.1471 13.5331 12.1153 13.4187 12.0588 13.3161C12.0022 13.2135 11.9225 13.1255 11.8259 13.0592C11.6894 12.9652 11.5147 12.8307 11.3412 12.6576C10.0253 11.3416 10.0198 9.20573 11.3412 7.88427L14.4912 4.73474C15.8149 3.41104 17.974 3.41901 19.2877 4.75865C20.5885 6.08521 20.5473 8.22431 19.2335 9.53802L18.6201 10.1515C18.4162 10.3554 18.3497 10.6573 18.4428 10.9302C18.7176 11.7361 18.8666 12.5707 18.897 13.4015C18.9208 14.0533 19.7151 14.3599 20.1764 13.8986L21.9157 12.1593C24.6941 9.38151 24.6941 4.86089 21.9158 2.08307Z" fill="#4F4F4F"/>
                            </svg>
                        </div>
                        <div id="websiteDetail" className="lstDetail">
                            {thisOfAppConstructor.data[match.params.id].website}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    getLocalStorage() {
        thisOfAppConstructor.state = {
            tdList: JSON.parse(localStorage.getItem('tdList')),
            tdDone: JSON.parse(localStorage.getItem('tdDone'))
        };
    }
    constructor(props) {
        super(props);
        thisOfAppConstructor = this;
        // Avoid being null
        if (localStorage.getItem('tdList') == null || localStorage.getItem('tdDone') == null || JSON.parse(localStorage.getItem('tdDone')).length != JSON.parse(localStorage.getItem('tdList')).length) {
            localStorage.setItem('tdList', JSON.stringify([]));
            localStorage.setItem('tdDone', JSON.stringify([]));
        }
        thisOfAppConstructor.getData();
        this.getLocalStorage();
    }
    render() {
        return (
            <BrowserRouter>
                <ul id="home">
                    <li>
                        <Link to="/todo-list">Todo list</Link>
                    </li>
                    <li>
                        <Link to="/users/0">User 0 details</Link>
                    </li>
                    <li>
                        <Link to="/users/1">User 1 details</Link>
                    </li>
                    <li>
                        <Link to="/users/2">User 2 details</Link>
                    </li>
                    <li>
                        <Link to="/users/3">User 3 details</Link>
                    </li>
                    <li>
                        <Link to="/users/4">User 4 details</Link>
                    </li>
                    <li>
                        <Link to="/users/5">User 5 details</Link>
                    </li>
                    <li>
                        <Link to="/users/6">User 6 details</Link>
                    </li>
                    <li>
                        <Link to="/users/7">User 7 details</Link>
                    </li>
                    <li>
                        <Link to="/users/8">User 8 details</Link>
                    </li>
                    <li>
                        <Link to="/users/9">User 9 details</Link>
                    </li>
                </ul>
                <Switch>
                    <Route path='/todo-list' component={this.TodoList} />
                    <Route path='/users/:id' component={this.Users} />
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
