import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import "./Breadcrumb.css";

interface BreadcrumbItem {
    label: string;
    path?: string; // If no path, it will be the current page (not clickable)
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => (
    <div className="breadcrumb">
        <div className="breadcrumbPill">
            {/* Home Starting Point */}
            <Link to="/" className="breadcrumbItem">Home</Link>

            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <ChevronRight size={14} className="breadcrumbSeparator" />
                    {index === items.length - 1 ? (
                        // Last Item: Show as active text
                        <span className="breadcrumbActive">
                            {item.label}
                        </span>
                    ) : (
                        // Intermediate Items: Show as Links
                        <Link to={item.path || "#"} className="breadcrumbItem">
                            {item.label}
                        </Link>
                    )}
                </React.Fragment>
            ))}
        </div>
    </div>
);