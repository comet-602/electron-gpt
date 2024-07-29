import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

//使用外部連結
const openExternalLink = (url) => {
  if (window.electron) {
    window.electron.openExternal(url);
  } else {
    console.error('Electron API is not available.');
  }
};

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState('Chatbot');
  const [newName, setNewName] = useState('');
  const [avatar, setAvatar] = useState(''); // 預設無圖片
  const [button1, setButton1] = useState({ name: '1', url: '#' });
  const [button2, setButton2] = useState({ name: '2', url: '#' });
  const menuRef = useRef(null);
  const iconRef = useRef(null);
  const fileInputRef = useRef(null);
  

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };
  
  //菜單的顯示
  const handleClickOutside = (event) => {
    if (
      menuRef.current && !menuRef.current.contains(event.target) &&
      iconRef.current && !iconRef.current.contains(event.target)
    ) {
      setMenuOpen(false);
    }
  };

  //點擊外部區域隱藏菜單
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  //進行名稱編輯
  const handleNameChange = () => {
    setEditingName(true);
    setNewName(name); // 預設新名稱為當前名稱
  };
  
  //輸出新名稱與退出編輯
  const handleNameSubmit = () => {
    setName(newName);
    setEditingName(false);
  };
  
  //名稱檢核
  const handleNameInputChange = (event) => {
    if (event.target.value.length <= 7) {
      setNewName(event.target.value);
    }
  };
  
  //觸發修改頭像功能
  const handleImageChange = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  //讀取檔案後，替換頭像
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result); // 更新為新上傳的圖片
      };
      reader.readAsDataURL(file);
    }
  };
  
  //從後端取得按鍵資訊(名稱，連結)
  useEffect(() => {
    const fetchButtonConfig = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/button-config');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setButton1(data.button1);
        setButton2(data.button2);
      } catch (error) {
        console.error('Error fetching button config:', error);
      }
    };
    fetchButtonConfig();

  }, []);
  
  //渲染套件
  return (
    <header className="App-header">
      <div className="header-content">
        <div className="user-info">
          <img src={avatar}  className="avatar" />
          {editingName ? (
            <input
              type="text"
              value={newName}
              onChange={handleNameInputChange}
              onBlur={handleNameSubmit}
              autoFocus
            />
          ) : (
            <span className="username">{name}</span>
          )}
          <div className="footer-buttons">
            <button className="footer-button" title={button1.name} onClick={() => openExternalLink(button1.url)}>1</button>
            <button className="footer-button" title={button2.name} onClick={() => openExternalLink(button2.url)}>2</button>
          </div>
        </div>
        <div className="menu-icon" onClick={toggleMenu} ref={iconRef}>
          <FontAwesomeIcon icon={faBars} />
          {menuOpen && (
            <div className="dropdown-menu" ref={menuRef}>
              <button onClick={handleImageChange}>修改頭像</button>
              <button onClick={handleNameChange}>修改名稱</button>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }} // 隱藏文件輸入框
            ref={fileInputRef}
            onChange={handleFileInputChange}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;