import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
    body, html, * {
        margin:0;
        padding:0;
    }
    body, html {
        width:100%;
        height:100%;
        font-family: "microsoft yahei",微软雅黑;
        font-size:12px;
        color:#4e4e4e;
    }
    ol, ul {
		list-style: none;
	}
    a {
		text-decoration: none;
	}
    #root{
        width:100%;
        height: 100%;    
        min-width: 1540px;
    }
    ::-webkit-scrollbar {
        /* 滚动条整体样式 */
        width: 10px;
        /*高宽分别对应横竖滚动条的尺寸*/
        height: 10px;
        background: transparent;
        border-radius: 4px;
        /* -webkit-box-shadow: inset 1px 0 1px rgba(0, 0, 0, 0.2); */
    }
    ::-webkit-scrollbar-thumb {
        /* 滚动条里面小方块 */
        background:rgba(144,147,153,.5);
        border-radius: 3px;
        /*height: 120px;*/
    }
    ::-webkit-scrollbar-thumb:hover
    {
        cursor: pointer;
        background-color: rgba(144,147,153,0.8);
    }
    .rc-select-dropdown{
        min-height:0 !important;
    }
    .kd_rangepicker_dropdown{
        z-index:100;
    }

`
