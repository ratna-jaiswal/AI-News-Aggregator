import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const NavBar = styled.nav`
  padding: 20px 0 0;
  background: var(--paper);
  border-bottom: 1px solid var(--line);
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  border-radius: 0;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 28px 18px;
`;

const NavHeader = styled.div`
  display: flex;
  align-items: center;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  margin: 0 0 0 24px;
  font-size: 13px;
  color: var(--ink-muted);
  font-weight: 700;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: var(--accent);
  }

  svg {
    margin-right: 8px;
  }
`;

const Logo = styled.div`
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 28px;
  letter-spacing: -1px;
  font-weight: 700;
  color: var(--ink);
`;

const CategoryContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 28px 14px;
  overflow-x: auto;
`;

const CategoryButton = styled.button`
  background: none;
  border: none;
  padding: 8px 13px;
  margin: 0;
  font-size: 14px;
  color: var(--ink-muted);
  cursor: pointer;
  transition: color 0.3s ease, background-color 0.3s ease;
  border-radius: 4px;

  &.active {
    background-color: var(--accent);
    color: var(--paper);
  }

  &:hover {
    color: var(--accent);
    background-color: var(--accent-soft);
  }
`;

const Navigation = ({ categories, currentCategory, setCurrentCategory, fetchNews }) => {
  return (
    <NavBar>
      <NavContainer>
        <NavHeader>
          <Logo>News / Daily</Logo>
          <NavLink to="/">
            <FaHome /> Home
          </NavLink>
        </NavHeader>
        <CategoryContainer>
          {categories.map((category) => (
            <CategoryButton
              key={category}
              className={currentCategory === category ? 'active' : ''}
              onClick={() => {
                setCurrentCategory(category);
                fetchNews(category);
              }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </CategoryButton>
          ))}
        </CategoryContainer>
      </NavContainer>
    </NavBar>
  );
};

export default Navigation;